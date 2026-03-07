import type { PipelineStage, Types } from 'mongoose';
import type { ProductQueryOptions } from '../types/product.types.js';

export const buildSearchStage = (search: string): PipelineStage => ({
  $search: {
    index: 'default',
    compound: {
      should: [
        {
          text: {
            query: search,
            path: 'title',
            fuzzy: { maxEdits: 1 },
            score: { boost: { value: 10 } },
          },
        },
        {
          text: {
            query: search,
            path: 'shortDescription',
            fuzzy: { maxEdits: 1 },
            score: { boost: { value: 5 } },
          },
        },
      ],
      minimumShouldMatch: 1,
    },
  },
});

export const buildMatchStage = (
  options: ProductQueryOptions,
  categoryId?: Types.ObjectId,
  brandId?: Types.ObjectId,
): PipelineStage => {
  const matchConditions: any = { status: 'active' };

  if (categoryId) matchConditions.category = categoryId;
  if (brandId) matchConditions.brand = brandId;

  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    matchConditions.price = {};
    if (options.minPrice !== undefined)
      matchConditions.price.$gte = options.minPrice;
    if (options.maxPrice !== undefined)
      matchConditions.price.$lte = options.maxPrice;
  }

  return { $match: matchConditions };
};

export const buildSortStage = (
  search: string | undefined,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
): PipelineStage | null => {
  if (!search || (search && sortBy !== 'createdAt')) {
    const sortStage: any = {};
    sortStage[sortBy] = sortOrder === 'desc' ? -1 : 1;
    return { $sort: sortStage };
  }
  return null; // Let Atlas Search sort by relevance
};

export const buildProjectionStage = (): PipelineStage => ({
  $project: {
    title: 1,
    slug: 1,
    shortDescription: 1,
    thumbnail: 1,
    gallary: 1,
    price: 1,
    status: 1,
    ratings: 1,
    numReviews: 1,
    isFeatured: 1,
    createdAt: 1,
    updatedAt: 1,
  },
});

export const buildPaginationStage = (
  page: number = 1,
  limit: number = 10,
): PipelineStage => {
  const skip = (page - 1) * limit;
  return {
    $facet: {
      metadata: [{ $count: 'total' }],
      data: [{ $skip: skip }, { $limit: limit }],
    },
  };
};
