import express from 'express';
import { handleCreateProduct, handleGetAllProducts } from '../controllers/product.controller.js';
import { createProductSchema } from '../schemas/product.schema.js';
import validate from '../middlewares/validate.middleware.js';
import { protect, requireVerification, restrictTo } from '../middlewares/auth.middleware.js';

const productRoute = express.Router();

productRoute.post('/create', validate(createProductSchema), protect, requireVerification, restrictTo('admin', 'manager'), handleCreateProduct);
productRoute.get('/', handleGetAllProducts)

export default productRoute;