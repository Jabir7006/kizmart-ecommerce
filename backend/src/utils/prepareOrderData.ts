import AppError from './AppError.js';
import { HTTP_STATUS } from '../constants/http.js';
import type { CartItem } from '../models/cart.model.js';

export function prepareOrderData(
  cartItems: CartItem[],
  productMap: Map<string, any>,
  city: string,
) {
  let subtotal = 0;
  let total = 0;
  let shippingFee = 0;

  const orderItems = cartItems.map((i) => {
    const product = productMap.get(i.product.toString());

    if (!product)
      throw new AppError('Product missing', HTTP_STATUS.INTERNAL_SERVER_ERROR);

    subtotal += product.price * i.quantity;

    if (city.toLowerCase() === 'dhaka') {
      shippingFee = 60;
    } else {
      shippingFee = 120;
    }

    total = subtotal + shippingFee;

    return {
      product: i.product,
      title: product.title,
      thumbnail: product.thumbnail,
      quantity: i.quantity,
      price: product.price,
    };
  });

  return { subtotal, orderItems, shippingFee, total };
}
