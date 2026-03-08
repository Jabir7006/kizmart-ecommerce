import express from 'express';
import {
  handleAddToCart,
  handleGetCart,
  handleRemoveFromCart,
  handleUpdateQuantity,
  handleClearCart
} from '../controllers/cart.controller.js';
import { addToCartSchema, removeFromCartSchema, updateQuantitySchema } from '../schemas/cart.schema.js';
import validate from '../middlewares/validate.middleware.js';

const cartRoute = express.Router();

cartRoute.post('/add', validate(addToCartSchema), handleAddToCart);
cartRoute.get('/', handleGetCart);
cartRoute.delete('/remove', validate(removeFromCartSchema), handleRemoveFromCart);
cartRoute.patch('/update-quantity', validate(updateQuantitySchema), handleUpdateQuantity);
cartRoute.delete('/clear', handleClearCart);

export default cartRoute;
