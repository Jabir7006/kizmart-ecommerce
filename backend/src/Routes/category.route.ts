import express from 'express';
import {
  handleCreateCategory,
  handleGetAllCategories,
  handleGetCategoryById,
  handleUpdateCategory,
  handleDeleteCategory,
} from '../controllers/category.controller.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../schemas/category.schema.js';
import validate from '../middlewares/validate.middleware.js';
import {
  protect,
  requireVerification,
  restrictTo,
} from '../middlewares/auth.middleware.js';

const categoryRoute = express.Router();

categoryRoute.get('/', handleGetAllCategories);
categoryRoute.get('/:id', handleGetCategoryById);
categoryRoute.post(
  '/create',
  validate(createCategorySchema),
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleCreateCategory,
);
categoryRoute.put(
  '/:id',
  validate(updateCategorySchema),
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleUpdateCategory,
);
categoryRoute.delete(
  '/:id',
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleDeleteCategory,
);

export default categoryRoute;
