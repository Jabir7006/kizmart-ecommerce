import express from 'express';
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetAllProducts,
  handleGetSinleProduct,
  handleUpdateProduct,
} from '../controllers/product.controller.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../schemas/product.schema.js';
import validate from '../middlewares/validate.middleware.js';
import {
  protect,
  requireVerification,
  restrictTo,
} from '../middlewares/auth.middleware.js';

const productRoute = express.Router();

productRoute.post(
  '/create',
  validate(createProductSchema),
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleCreateProduct,
);
productRoute.get('/', handleGetAllProducts);
productRoute.get('/:slug', handleGetSinleProduct);
productRoute.patch(
  '/:id',
  validate(updateProductSchema),
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleUpdateProduct,
);
productRoute.delete(
  '/:id',
  protect,
  requireVerification,
  restrictTo('admin', 'manager'),
  handleDeleteProduct,
);

export default productRoute;
