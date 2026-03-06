import express from 'express';
import {
  handleCreateBrand,
  handleGetAllBrands,
  handleGetBrandById,
  handleUpdateBrand,
  handleDeleteBrand,
} from '../controllers/brand.controller.js';
import {
  createBrandSchema,
  updateBrandSchema,
} from '../schemas/brand.schema.js';
import validate from '../middlewares/validate.middleware.js';
import {
  protect,
  requireVerification,
  restrictTo,
} from '../middlewares/auth.middleware.js';

const brandRoute = express.Router();

brandRoute.get('/', handleGetAllBrands);
brandRoute.get('/:id', handleGetBrandById);
brandRoute.post(
  '/create',
  validate(createBrandSchema),
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleCreateBrand,
);
brandRoute.put(
  '/:id',
  validate(updateBrandSchema),
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleUpdateBrand,
);
brandRoute.delete(
  '/:id',
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleDeleteBrand,
);

export default brandRoute;
