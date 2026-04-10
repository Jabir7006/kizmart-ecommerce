import { HTTP_STATUS } from '../constants/http.js';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getMyReview,
  updateReview,
} from '../services/review.service.js';
import catchAsync from '../utils/catchAsync.js';

export const handleCreateReview = catchAsync(async (req, res) => {
  const review = await createReview(req.user.userId as string, req.body);

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message: 'Review created successfully',
    data: review,
  });
});

export const handleGetAllReviews = catchAsync(async (req, res) => {
  const options = {
    productId: req.query.productId as string,
    page: req.query.page ? Math.max(1, Number(req.query.page)) : 1,
    limit: req.query.limit ? Math.max(1, Number(req.query.limit)) : 10,
    ...(req.query.sortBy
      ? {
          sortBy: req.query.sortBy as
            | 'newest'
            | 'oldest'
            | 'highest-rating'
            | 'lowest-rating',
        }
      : {}),
    ...(req.query.star ? { star: Number(req.query.star) } : {}),
  };

  const reviews = await getAllReviews(options);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: reviews,
  });
});

export const handleGetMyReview = catchAsync(async (req, res) => {
  const review = await getMyReview(
    req.user.userId as string,
    req.query.productId as string,
  );

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: review,
  });
});

export const handleUpdateReview = catchAsync(async (req, res) => {
  const review = await updateReview(
    req.params.id as string,
    req.user,
    req.body,
  );

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Review updated successfully',
    data: review,
  });
});

export const handleDeleteReview = catchAsync(async (req, res) => {
  await deleteReview(req.params.id as string, req.user);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Review deleted successfully',
  });
});
