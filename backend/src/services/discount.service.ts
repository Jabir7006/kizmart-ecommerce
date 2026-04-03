import { Types } from 'mongoose';
import Discount, { type IDiscount } from '../models/discount.model.js';
import Product from '../models/product.model.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import type {
  DiscountQueryOptions,
  PaginatedDiscountResult,
} from '../types/discount.types.js';

// ─── Price Calculation ───────────────────────────────────────────────────────

/**
 * Calculate the discounted sale price for a product.
 */
const calculateSalePrice = (
  originalPrice: number,
  discountType: 'percentage' | 'fixed',
  value: number,
): number => {
  if (discountType === 'percentage') {
    return Math.round(originalPrice * (1 - value / 100) * 100) / 100;
  }
  // Fixed discount
  return Math.max(0, Math.round((originalPrice - value) * 100) / 100);
};

// ─── Sync Helpers ────────────────────────────────────────────────────────────

/**
 * Find every product that a discount targets, compute its salePrice,
 * and stamp the activeDiscount reference on the product document.
 */
const syncProductPrices = async (discount: IDiscount): Promise<number> => {
  const now = new Date();

  // Only sync if the discount is currently active and within its date window
  const isCurrentlyEffective =
    discount.isActive &&
    new Date(discount.startDate) <= now &&
    new Date(discount.endDate) >= now;

  if (!isCurrentlyEffective) return 0;

  // Build filter for affected products based on targetType
  const filter = buildTargetFilter(discount);

  const products = await Product.find(filter).select('_id price');

  if (products.length === 0) return 0;

  const bulkOps = products.map((product) => ({
    updateOne: {
      filter: { _id: product._id },
      update: {
        $set: {
          salePrice: calculateSalePrice(
            product.price,
            discount.discountType,
            discount.value,
          ),
          activeDiscount: discount._id,
        },
      },
    },
  }));

  const result = await Product.bulkWrite(bulkOps);
  return result.modifiedCount;
};

/**
 * Revert every product that was using a given discount back to its
 * original price and clear the activeDiscount reference.
 */
const revertProductPrices = async (
  discountId: Types.ObjectId,
): Promise<number> => {
  // Find all products that currently reference this discount
  const products = await Product.find({ activeDiscount: discountId }).select(
    '_id price',
  );

  if (products.length === 0) return 0;

  const bulkOps = products.map((product) => ({
    updateOne: {
      filter: { _id: product._id },
      update: {
        $set: {
          salePrice: product.price, // reset to original
          activeDiscount: null,
        },
      },
    },
  }));

  const result = await Product.bulkWrite(bulkOps);
  return result.modifiedCount;
};

/**
 * Build a Mongoose filter to select products affected by a discount.
 */
const buildTargetFilter = (discount: IDiscount): Record<string, any> => {
  switch (discount.targetType) {
    case 'product':
      return { _id: { $in: discount.targetProducts } };
    case 'category':
      return { category: { $in: discount.targetCategories } };
    case 'all':
      return {}; // every product
    default:
      return { _id: null }; // match nothing
  }
};

// ─── CRUD ────────────────────────────────────────────────────────────────────

export const createDiscount = async (data: Partial<IDiscount>) => {
  // Validate date range
  if (data.startDate && data.endDate) {
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      throw new AppError(
        'Start date must be before end date',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }

  const discount = await Discount.create(data);

  // Sync prices immediately for affected products
  const synced = await syncProductPrices(discount);

  return { discount, syncedCount: synced };
};

const buildStatusMatch = (status?: DiscountQueryOptions['status']) => {
  if (!status) return null;

  const now = new Date();

  switch (status) {
    case 'active':
      return {
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      };
    case 'inactive':
      return {
        isActive: false,
      };
    case 'upcoming':
      return {
        isActive: true,
        startDate: { $gt: now },
      };
    case 'expired':
      return {
        isActive: true,
        endDate: { $lt: now },
      };
    default:
      return null;
  }
};

export const getAllDiscounts = async (
  options: DiscountQueryOptions = {},
): Promise<PaginatedDiscountResult<unknown>> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy ?? 'createdAt';
  const sortOrder = options.sortOrder === 'asc' ? 1 : -1;

  const matchStage: Record<string, any> = {};

  if (options.search) {
    matchStage.name = { $regex: new RegExp(options.search, 'i') };
  }
  if (options.discountType) {
    matchStage.discountType = options.discountType;
  }
  if (options.targetType) {
    matchStage.targetType = options.targetType;
  }
  if (options.isActive !== undefined) {
    matchStage.isActive = options.isActive;
  }

  const statusMatch = buildStatusMatch(options.status);
  if (statusMatch) {
    Object.assign(matchStage, statusMatch);
  }

  const result = await Discount.aggregate([
    { $match: matchStage },
    { $sort: { [sortBy]: sortOrder } },
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: 'products',
              localField: 'targetProducts',
              foreignField: '_id',
              as: 'targetProducts',
              pipeline: [{ $project: { title: 1, slug: 1, price: 1 } }],
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'targetCategories',
              foreignField: '_id',
              as: 'targetCategories',
              pipeline: [{ $project: { title: 1, slug: 1 } }],
            },
          },
          {
            $addFields: {
              status: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ['$isActive', false] },
                      then: 'inactive',
                    },
                    {
                      case: { $gt: ['$startDate', '$$NOW'] },
                      then: 'upcoming',
                    },
                    {
                      case: { $lt: ['$endDate', '$$NOW'] },
                      then: 'expired',
                    },
                  ],
                  default: 'active',
                },
              },
            },
          },
        ],
      },
    },
  ]);

  const data = result[0]?.data ?? [];
  const total = result[0]?.metadata?.[0]?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    metadata: { total, page, totalPages, limit },
    data,
  };
};

export const getDiscountById = async (id: string) => {
  const discount = await Discount.findById(id)
    .populate('targetProducts', 'title slug price')
    .populate('targetCategories', 'title slug')
    .lean();

  if (!discount) {
    throw new AppError('Discount not found', HTTP_STATUS.NOT_FOUND);
  }
  return discount;
};

export const updateDiscount = async (id: string, data: Partial<IDiscount>) => {
  const existing = await Discount.findById(id);
  if (!existing) {
    throw new AppError('Discount not found', HTTP_STATUS.NOT_FOUND);
  }

  // Validate date range if both dates are present (either from update or existing)
  const startDate = data.startDate ?? existing.startDate;
  const endDate = data.endDate ?? existing.endDate;
  if (new Date(startDate) >= new Date(endDate)) {
    throw new AppError(
      'Start date must be before end date',
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  // Step 1: Revert all products currently using this discount
  await revertProductPrices(existing._id as Types.ObjectId);

  // Step 2: Apply the update
  const updated = await Discount.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  )
    .populate('targetProducts', 'title slug price')
    .populate('targetCategories', 'title slug');

  if (!updated) {
    throw new AppError('Discount not found', HTTP_STATUS.NOT_FOUND);
  }

  // Step 3: Re-sync with new values / targets
  const synced = await syncProductPrices(updated);

  return { discount: updated, syncedCount: synced };
};

export const deleteDiscount = async (id: string) => {
  const discount = await Discount.findById(id);
  if (!discount) {
    throw new AppError('Discount not found', HTTP_STATUS.NOT_FOUND);
  }

  // Revert every product that was using this discount
  const reverted = await revertProductPrices(discount._id as Types.ObjectId);

  await Discount.findByIdAndDelete(id);

  return { revertedCount: reverted };
};

/**
 * Toggle discount active status. Activating re-syncs prices,
 * deactivating reverts them.
 */
export const toggleDiscountStatus = async (id: string) => {
  const discount = await Discount.findById(id);
  if (!discount) {
    throw new AppError('Discount not found', HTTP_STATUS.NOT_FOUND);
  }

  const newStatus = !discount.isActive;
  discount.isActive = newStatus;
  await discount.save();

  if (newStatus) {
    // Re-activated → sync prices
    const synced = await syncProductPrices(discount);
    return { discount, syncedCount: synced };
  } else {
    // Deactivated → revert prices
    const reverted = await revertProductPrices(discount._id as Types.ObjectId);
    return { discount, revertedCount: reverted };
  }
};

// ─── Expiry Cleanup ──────────────────────────────────────────────────────────

/**
 * Find all discounts whose endDate has passed and revert their products.
 * Designed to be called by a cron job or at server start.
 */
export const cleanupExpiredDiscounts = async (): Promise<number> => {
  const now = new Date();

  const expired = await Discount.find({
    isActive: true,
    endDate: { $lt: now },
  });

  let totalReverted = 0;

  for (const discount of expired) {
    const reverted = await revertProductPrices(discount._id as Types.ObjectId);
    totalReverted += reverted;

    // Mark the discount as inactive so it's not processed again
    discount.isActive = false;
    await discount.save();
  }

  return totalReverted;
};

/**
 * Find all discounts whose startDate has arrived but are still inactive,
 * activate them, and sync product prices.
 * Designed to be called by a cron job alongside cleanupExpiredDiscounts.
 */
export const activateScheduledDiscounts = async (): Promise<number> => {
  const now = new Date();

  const scheduled = await Discount.find({
    isActive: false,
    startDate: { $lte: now },
    endDate: { $gt: now },
  });

  let totalSynced = 0;

  for (const discount of scheduled) {
    discount.isActive = true;
    await discount.save();

    const synced = await syncProductPrices(discount);
    totalSynced += synced;
  }

  return totalSynced;
};
