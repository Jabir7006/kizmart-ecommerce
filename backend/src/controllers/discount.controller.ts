import { HTTP_STATUS } from '../constants/http.js';
import {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
} from '../services/discount.service.js';
import type { Request } from 'express';
import catchAsync from '../utils/catchAsync.js';
import type { DiscountQueryOptions } from '../types/discount.types.js';

const extractDiscountQueryOptions = (req: Request): DiscountQueryOptions => {
  const options: DiscountQueryOptions = {};

  if (req.query.q) options.search = req.query.q as string;
  if (req.query.discountType) {
    options.discountType = req.query.discountType as 'percentage' | 'fixed';
  }
  if (req.query.targetType) {
    options.targetType = req.query.targetType as 'product' | 'category' | 'all';
  }
  if (req.query.isActive !== undefined) {
    options.isActive = req.query.isActive === 'true';
  }
  if (req.query.status) {
    options.status = req.query.status as DiscountQueryOptions['status'];
  }
  if (req.query.sortBy) {
    options.sortBy = req.query.sortBy as DiscountQueryOptions['sortBy'];
  }
  if (req.query.sortOrder) {
    options.sortOrder = req.query.sortOrder as 'asc' | 'desc';
  }
  if (req.query.page) options.page = Math.max(1, Number(req.query.page));
  if (req.query.limit) {
    options.limit = Math.min(100, Math.max(1, Number(req.query.limit)));
  }

  return options;
};

export const handleCreateDiscount = catchAsync(async (req, res) => {
  const { discount, syncedCount } = await createDiscount(req.body);

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message: `Discount created — ${syncedCount} product(s) updated`,
    data: discount,
  });
});

export const handleGetAllDiscounts = catchAsync(async (req, res) => {
  const options = extractDiscountQueryOptions(req);
  const discounts = await getAllDiscounts(options);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: discounts,
  });
});

export const handleGetDiscountById = catchAsync(async (req, res) => {
  const discount = await getDiscountById(req.params.id as string);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: discount,
  });
});

export const handleUpdateDiscount = catchAsync(async (req, res) => {
  const { discount, syncedCount } = await updateDiscount(
    req.params.id as string,
    req.body,
  );

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: `Discount updated — ${syncedCount} product(s) synced`,
    data: discount,
  });
});

export const handleDeleteDiscount = catchAsync(async (req, res) => {
  const { revertedCount } = await deleteDiscount(req.params.id as string);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: `Discount deleted — ${revertedCount} product(s) reverted`,
  });
});

export const handleToggleDiscountStatus = catchAsync(async (req, res) => {
  const result = await toggleDiscountStatus(req.params.id as string);

  const isNowActive = result.discount.isActive;
  const count = isNowActive
    ? (result as any).syncedCount
    : (result as any).revertedCount;

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: isNowActive
      ? `Discount activated — ${count} product(s) updated`
      : `Discount deactivated — ${count} product(s) reverted`,
    data: result.discount,
  });
});
