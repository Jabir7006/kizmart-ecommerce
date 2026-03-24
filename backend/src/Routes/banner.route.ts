import express from 'express';
import {
  handleCreateBanner,
  handleGetAllBanners,
  handleGetBannerById,
  handleUpdateBanner,
  handleDeleteBanner,
} from '../controllers/banner.controller.js';
import {
  createBannerSchema,
  updateBannerSchema,
} from '../schemas/banner.schema.js';
import validate from '../middlewares/validate.middleware.js';
import {
  protect,
  requireVerification,
  restrictTo,
} from '../middlewares/auth.middleware.js';

const bannerRoute = express.Router();

bannerRoute.get('/', handleGetAllBanners);
bannerRoute.get('/:id', handleGetBannerById);

bannerRoute.post(
  '/create',
  validate(createBannerSchema),
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleCreateBanner,
);

bannerRoute.put(
  '/:id',
  validate(updateBannerSchema),
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleUpdateBanner,
);

bannerRoute.delete(
  '/:id',
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleDeleteBanner,
);

export default bannerRoute;
