import { Types } from 'mongoose';
import { HTTP_STATUS } from '../constants/http.js';
import Product from '../models/product.model.js';
import Review from '../models/review.model.js';
import AppError from '../utils/AppError.js';

type CreateReviewInput = {
  product: string;
  rating: number;
  comment: string;
};

type UpdateReviewInput = Partial<{
  rating: number;
  comment: string;
}>;

type ReviewQueryOptions = {
  productId: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'highest-rating' | 'lowest-rating';
  star?: number;
};

const updateProductReviewStats = async (productId: Types.ObjectId | string) => {
  const normalizedProductId =
    typeof productId === 'string' ? new Types.ObjectId(productId) : productId;

  const [stats] = await Review.aggregate([
    {
      $match: {
        product: normalizedProductId,
      },
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(normalizedProductId, {
    ratings: stats ? Number(stats.averageRating.toFixed(1)) : 0,
    numReviews: stats?.totalReviews || 0,
  });
};

export const createReview = async (userId: string, data: CreateReviewInput) => {
  const product = await Product.findById(data.product)
    .select('_id status')
    .lean();

  if (!product) {
    throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
  }

  const existingReview = await Review.findOne({
    product: data.product,
    user: userId,
  })
    .select('_id')
    .lean();

  if (existingReview) {
    throw new AppError(
      'You have already reviewed this product',
      HTTP_STATUS.CONFLICT,
    );
  }

  const review = await Review.create({
    ...data,
    user: userId,
  });

  await updateProductReviewStats(review.product);

  return Review.findById(review._id).populate('user', 'fullName');
};

export const getAllReviews = async (options: ReviewQueryOptions) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || 'newest';

  const filters: Record<string, unknown> = {
    product: options.productId,
  };

  if (options.star !== undefined) {
    filters.rating = options.star;
  }

  const sortOptions: Record<string, 1 | -1> = {
    createdAt: -1,
  };

  if (sortBy === 'oldest') {
    sortOptions.createdAt = 1;
  }

  if (sortBy === 'highest-rating') {
    sortOptions.rating = -1;
    sortOptions.createdAt = -1;
  }

  if (sortBy === 'lowest-rating') {
    sortOptions.rating = 1;
    sortOptions.createdAt = -1;
  }

  const [total, reviews] = await Promise.all([
    Review.countDocuments(filters),
    Review.find(filters)
      .populate('user', 'fullName')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    metadata: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    },
    data: reviews,
  };
};

export const updateReview = async (
  id: string,
  user: { _id: string; role: string },
  data: UpdateReviewInput,
) => {
  const review = await Review.findById(id);

  if (!review) {
    throw new AppError('Review not found', HTTP_STATUS.NOT_FOUND);
  }

  const isOwner = review.user.toString() === user._id;
  const isPrivileged = ['admin', 'manager'].includes(user.role);

  if (!isOwner && !isPrivileged) {
    throw new AppError(
      'You do not have permission to update this review',
      HTTP_STATUS.FORBIDDEN,
    );
  }

  if (data.rating !== undefined) review.rating = data.rating;
  if (data.comment !== undefined) review.comment = data.comment;

  await review.save();
  await updateProductReviewStats(review.product);

  return Review.findById(review._id).populate('user', 'fullName');
};

export const deleteReview = async (
  id: string,
  user: { _id: string; role: string },
) => {
  const review = await Review.findById(id);

  if (!review) {
    throw new AppError('Review not found', HTTP_STATUS.NOT_FOUND);
  }

  const isOwner = review.user.toString() === user._id;
  const isPrivileged = ['admin', 'manager'].includes(user.role);

  if (!isOwner && !isPrivileged) {
    throw new AppError(
      'You do not have permission to delete this review',
      HTTP_STATUS.FORBIDDEN,
    );
  }

  await Review.findByIdAndDelete(id);
  await updateProductReviewStats(review.product);
};
