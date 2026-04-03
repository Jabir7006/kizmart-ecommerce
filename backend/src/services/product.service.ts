import slugify from 'slugify';
import { Types } from 'mongoose';
import type {
  PaginatedResult,
  ProductInput,
  ProductQueryOptions,
  SimilarProductsOptions,
} from '../types/product.types.js';
import Product, { type IImage } from '../models/product.model.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import Category from '../models/category.model.js';
import Brand from '../models/brand.model.js';
import { QueryBuilder } from '../utils/queryBuilder.js';

export const createProduct = async (data: ProductInput) => {
  const product = await Product.create({
    ...data,
    // @ts-expect-error slugify types are not compatible with typescript
    slug: slugify(data.title, { lower: true }),
  });
  return product;
};

export const getAllProducts = async (
  options: ProductQueryOptions,
): Promise<PaginatedResult<any>> => {
  let categoryId: Types.ObjectId | undefined;
  let brandId: Types.ObjectId | undefined;

  const noMeta = {
    metadata: {
      total: 0,
      page: options.page || 1,
      totalPages: 0,
      limit: options.limit || 10,
    },
    data: [],
  };

  if (options.categorySlug) {
    const category = await Category.findOne({
      slug: options.categorySlug,
    })
      .select('_id')
      .lean();
    // If user searches for a category that doesn't exist, return empty results early
    if (!category) return noMeta;
    categoryId = category._id;
  }

  if (options.brandSlug) {
    const brand = await Brand.findOne({ slug: options.brandSlug })
      .select('_id')
      .lean();
    if (!brand) return noMeta;
    brandId = brand._id;
  }

  const baseMatch: Record<string, any> = {};

  if (options.status && options.status !== 'all') {
    baseMatch.status = options.status;
  } else if (!options.status) {
    baseMatch.status = 'active';
  }

  if (categoryId) baseMatch.category = categoryId;
  if (brandId) baseMatch.brand = brandId;
  if (options.isFeatured === 'true' || options.isFeatured === true) {
    baseMatch.isFeatured = true;
  }

  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    const price: { $gte?: number; $lte?: number } = {};
    if (options.minPrice !== undefined) price.$gte = options.minPrice;
    if (options.maxPrice !== undefined) price.$lte = options.maxPrice;
    baseMatch.price = price;
  }

  const queryBuilder = new QueryBuilder({
    options: {
      ...options,
      search: options.search || '',
    },
    baseMatch,
    searchableFields: ['title', 'shortDescription'],
    useAtlasSearch: true,
    atlasIndex: 'default',
    projection: {
      title: 1,
      slug: 1,
      shortDescription: 1,
      thumbnail: 1,
      price: 1,
      salePrice: 1,
      activeDiscount: 1,
      status: 1,
      quantity: 1,
      ratings: 1,
      numReviews: 1,
      isFeatured: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  });

  const pipeline = queryBuilder.buildPipeline();

  const result = await Product.aggregate(pipeline);

  const data = result[0]?.data || [];
  const total = result[0]?.metadata[0]?.total || 0;
  const limit = options.limit || 10;
  const page = options.page || 1;
  const totalPages = Math.ceil(total / limit);

  return {
    metadata: { total, page, totalPages, limit },
    data,
  };
};

export const getProductBySlug = async (slug: string) => {
  const product = await Product.findOne({ slug })
    .populate('category', 'title slug')
    .populate('brand', 'title slug')
    .lean();
  if (!product) {
    throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
  }
  return product;
};

export const getSimilarProductsBySlug = async (
  slug: string,
  options: SimilarProductsOptions = {},
) => {
  const currentProduct = await Product.findOne({ slug, status: 'active' })
    .select('_id category brand price')
    .lean();

  if (!currentProduct) {
    throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
  }

  const limit = options.limit || 8;
  const minPrice = Math.max(0, currentProduct.price * 0.8);
  const maxPrice = currentProduct.price * 1.2;

  const currentBrand = currentProduct.brand || null;

  const similarProducts = await Product.aggregate([
    {
      $match: {
        _id: { $ne: currentProduct._id },
        status: 'active',
        category: currentProduct.category,
      },
    },
    {
      $addFields: {
        similarityScore: {
          $add: [
            {
              $cond: [
                {
                  $and: [
                    { $ne: ['$brand', null] },
                    { $eq: ['$brand', currentBrand] },
                  ],
                },
                3,
                0,
              ],
            },
            {
              $cond: [
                {
                  $and: [
                    { $gte: ['$price', minPrice] },
                    { $lte: ['$price', maxPrice] },
                  ],
                },
                2,
                0,
              ],
            },
            {
              $cond: [
                { $gt: [{ $ifNull: ['$ratings', 0] }, 0] },
                '$ratings',
                0,
              ],
            },
          ],
        },
      },
    },
    { $sort: { similarityScore: -1, sold: -1, createdAt: -1 } },
    { $limit: limit },
    {
      $project: {
        title: 1,
        slug: 1,
        shortDescription: 1,
        thumbnail: 1,
        price: 1,
        salePrice: 1,
        ratings: 1,
        numReviews: 1,
        brand: 1,
      },
    },
  ]);

  return similarProducts;
};
import { UploadService } from './upload.service.js';

export const updateProduct = async (
  id: string,
  data: Partial<ProductInput>,
) => {
  const existing = await Product.findById(id);
  if (!existing) {
    throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
  }

  // Re-slugify only when title actually changes
  const updates: Record<string, any> = { ...data };
  if (data.title && data.title !== existing.title) {
    // @ts-expect-error slugify types are not compatible with typescript
    updates.slug = slugify(data.title, { lower: true });
  }

  // Delete old thumbnail from Cloudinary only when a new one is supplied
  if (
    data.thumbnail &&
    existing.thumbnail?.publicId &&
    data.thumbnail.publicId !== existing.thumbnail.publicId
  ) {
    await UploadService.deleteImage(existing.thumbnail.publicId).catch(() => {
      /* non-fatal */
    });
  }

  // Delete orphaned gallery images that were removed in the update
  if (data.gallery && existing.gallery && existing.gallery.length > 0) {
    const newPublicIds = new Set(
      data.gallery.map((img: IImage) => img.publicId),
    );
    const orphans = existing.gallery.filter(
      (img: IImage) => img.publicId && !newPublicIds.has(img.publicId),
    );
    await Promise.allSettled(
      orphans.map((img: IImage) => UploadService.deleteImage(img.publicId)),
    );
  }

  const updated = await Product.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true },
  )
    .populate('category', 'title slug')
    .populate('brand', 'title slug')
    .lean();

  return updated;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
  }

  // Delete associated images from Cloudinary
  if (product.thumbnail && product.thumbnail.publicId) {
    await UploadService.deleteImage(product.thumbnail.publicId);
  }

  if (product.gallery && product.gallery.length > 0) {
    const deletePromises = product.gallery
      .filter((img: IImage) => img && img.publicId)
      .map((img: IImage) => UploadService.deleteImage(img.publicId));

    await Promise.allSettled(deletePromises);
  }
};
