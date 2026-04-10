import express from 'express';
import {
  handleCreateReview,
  handleDeleteReview,
  handleGetAllReviews,
  handleGetMyReview,
  handleUpdateReview,
} from '../controllers/review.controller.js';
import {
  createReviewSchema,
  getAllReviewsSchema,
  getMyReviewSchema,
  getReviewSchema,
  updateReviewSchema,
} from '../schemas/review.schema.js';
import {
  protect,
  requireVerification,
} from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';

const reviewRoute = express.Router();

reviewRoute.get('/', validate(getAllReviewsSchema), handleGetAllReviews);
reviewRoute.get(
  '/mine',
  validate(getMyReviewSchema),
  protect,
  requireVerification,
  handleGetMyReview,
);
reviewRoute.post(
  '/create',
  validate(createReviewSchema),
  protect,
  requireVerification,
  handleCreateReview,
);
reviewRoute.patch(
  '/:id',
  validate(updateReviewSchema),
  protect,
  requireVerification,
  handleUpdateReview,
);
reviewRoute.delete(
  '/:id',
  validate(getReviewSchema),
  protect,
  requireVerification,
  handleDeleteReview,
);

export default reviewRoute;
