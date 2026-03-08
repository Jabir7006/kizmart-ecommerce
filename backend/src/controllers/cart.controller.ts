import catchAsync from '../utils/catchAsync.js';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart
} from '../services/cart.service.js';
import { HTTP_STATUS } from '../constants/http.js';

export const handleAddToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId;
  await addToCart({ userId, productId, quantity });

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Product added to cart',
  });
});

export const handleGetCart = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const cart = await getCart(userId);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: cart,
  });
});

export const handleRemoveFromCart = catchAsync(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.userId;
  await removeFromCart({ userId, productId });

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Product removed from cart',
  });
});

export const handleUpdateQuantity = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId;
  await updateCartItemQuantity({ userId, productId, quantity });

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Cart item quantity updated',
  });
});

export const handleClearCart = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  await clearCart(userId);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Cart cleared successfully',
  });
});
