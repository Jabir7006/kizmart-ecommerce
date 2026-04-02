import AppError from './AppError.js';
import { HTTP_STATUS } from '../constants/http.js';
import type { CartItem } from '../models/cart.model.js';

export function prepareOrderData(
  cartItems: CartItem[],
  productMap: Map<string, any>,
  city: string,
) {
  let subtotal = 0;

  // 1. Process items and calculate subtotal
  const orderItems = cartItems.map((i) => {
    const product = productMap.get(i.product.toString());

    if (!product) {
      throw new AppError('Product missing', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const effectivePrice = product.salePrice ?? product.price;
    subtotal += effectivePrice * i.quantity;

    return {
      product: i.product,
      title: product.title,
      thumbnail: product.thumbnail,
      quantity: i.quantity,
      price: effectivePrice,
    };
  });

  // 2. Calculate shipping and final total ONCE outside the loop
  const shippingFee = city.toLowerCase() === 'dhaka' ? 60 : 120;
  const total = subtotal + shippingFee;

  return { subtotal, orderItems, shippingFee, total };
}
