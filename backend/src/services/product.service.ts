import slugify from 'slugify';
import Product from '../models/product.model.js';
import type {
  PaginatedResult,
  ProductInput,
  ProductQueryOptions,
} from '../types/product.types.js';
import type { PipelineStage } from 'mongoose';
import { Types } from 'mongoose';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import {
  buildMatchStage,
  buildPaginationStage,
  buildProjectionStage,
  buildSearchStage,
  buildSortStage,
} from '../utils/productPipeline.js';
import Category from '../models/category.model.js';
import Brand from '../models/brand.model.js';

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
  // 1. Resolve Slugs to ObjectIds
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

  // 2. Assemble the Pipeline
  const pipeline: PipelineStage[] = [];

  if (options.search) {
    pipeline.push(buildSearchStage(options.search));
  }

  pipeline.push(buildMatchStage(options, categoryId, brandId));

  const sortStage = buildSortStage(
    options.search,
    options.sortBy,
    options.sortOrder,
  );
  if (sortStage) pipeline.push(sortStage);

  pipeline.push(buildProjectionStage());
  pipeline.push(buildPaginationStage(options.page, options.limit));

  // 3. Execute
  const result = await Product.aggregate(pipeline);

  // 4. Format Output
  const data = result[0]?.data || [];
  const total = result[0]?.metadata[0]?.total || 0;
  const limit = options.limit || 10;
  const page = options.page || 1;
  const totalPages = Math.ceil(total / limit);

  if (!data || data.length === 0) {
    throw new AppError('No products found', HTTP_STATUS.NOT_FOUND);
  }

  return {
    metadata: { total, page, totalPages, limit },
    data,
  };
};
