import { HTTP_STATUS } from '../constants/http.js';
import { CartStatus } from '../constants/status.js';
import { Cart } from '../models/cart.model.js';
import Product from '../models/product.model.js';
import AppError from '../utils/AppError.js';

type AddToCartService = {
  productId: string;
  quantity: number;
  userId: string;
};

export const addToCart = async ({
  userId,
  productId,
  quantity,
}: AddToCartService) => {
  const product = await Product.findById(productId).select('price');
  if (!product) throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);

  let cart = await Cart.findOneAndUpdate(
    {
      user: userId,
      status: CartStatus.ACTIVE,
      'items.product': productId,
    },
    {
      $inc: { 'items.$.quantity': quantity },
      $set: { 'items.$.price': product.price },
    },
    { new: true },
  );

  if (!cart) {
    cart = await Cart.findOneAndUpdate(
      { user: userId, status: CartStatus.ACTIVE },
      {
        $push: {
          items: { product: productId, quantity, price: product.price },
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  return await cart?.save();
};

export const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId, status: CartStatus.ACTIVE })
    .populate('items.product', 'title price thumbnail')
    .select('-__v');
  return cart;
};

export const removeFromCart = async ({
  userId,
  productId,
}: Omit<AddToCartService, 'quantity'>) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId, status: CartStatus.ACTIVE },
    { $pull: { items: { product: productId } } },
    { new: true },
  );

  return await cart?.save();
};

export const updateCartItemQuantity = async ({
  userId,
  productId,
  quantity,
}: AddToCartService) => {
  const cart = await Cart.findOne({ user: userId, status: CartStatus.ACTIVE });
  if (!cart) throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND);

  const item = cart.items.find((item) => item.product.toString() === productId);
  if (!item)
    throw new AppError('Product not found in cart', HTTP_STATUS.NOT_FOUND);

  const newQuantity = item.quantity + quantity;
  if (newQuantity < 1) {
    throw new AppError(
      'Quantity cannot be less than 1. Use remove item instead.',
      400,
    );
  }

  item.quantity = newQuantity;
  return await cart.save();
};

export const clearCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId, status: CartStatus.ACTIVE });
  if (!cart) return null;

  cart.items = [];
  return await cart.save();
};
