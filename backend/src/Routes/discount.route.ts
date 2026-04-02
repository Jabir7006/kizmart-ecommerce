import express from 'express';
import {
  handleCreateDiscount,
  handleGetAllDiscounts,
  handleGetDiscountById,
  handleUpdateDiscount,
  handleDeleteDiscount,
  handleToggleDiscountStatus,
} from '../controllers/discount.controller.js';
import {
  createDiscountSchema,
  updateDiscountSchema,
} from '../schemas/discount.schema.js';
import validate from '../middlewares/validate.middleware.js';

const discountRoute = express.Router();

discountRoute.post('/', validate(createDiscountSchema), handleCreateDiscount);
discountRoute.get('/', handleGetAllDiscounts);
discountRoute.get('/:id', handleGetDiscountById);
discountRoute.patch(
  '/:id',
  validate(updateDiscountSchema),
  handleUpdateDiscount,
);
discountRoute.patch('/:id/toggle', handleToggleDiscountStatus);
discountRoute.delete('/:id', handleDeleteDiscount);

export default discountRoute;
