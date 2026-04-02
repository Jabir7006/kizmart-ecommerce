import type { ClientSession } from 'mongoose';
import AppError from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/http.js';
import Product from '../models/product.model.js';
import type { CartItem } from '../models/cart.model.js';
import mongoose from 'mongoose';

export const fetchProductMap = async (
  cartItems: CartItem[],
  session: ClientSession,
) => {
  const productIds = cartItems.map((i) => i.product);
  const products = await Product.find(
    { _id: { $in: productIds } },
    { price: 1, salePrice: 1, quantity: 1, title: 1, thumbnail: 1 },
  )
    .session(session)
    .lean();

  return new Map(products.map((p) => [p._id.toString(), p]));
};

export async function deductInventoryOrThrow(
  cartItems: any[],
  productMap: Map<string, any>,
  session: ClientSession,
) {
  for (const item of cartItems) {
    const product = productMap.get(item.product.toString());

    if (!product) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
    }

    // Explicitly check if the user is asking for too much
    if (product.quantity < item.quantity) {
      throw new AppError(
        `Insufficient stock for "${product.title}". Only ${product.quantity} left in stock.`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }

  const bulkInventoryOps = cartItems.map((item) => {
    return {
      updateOne: {
        filter: {
          _id: new mongoose.Types.ObjectId(item.product.toString()),
          quantity: { $gte: item.quantity },
        },
        update: {
          $inc: {
            quantity: -item.quantity,
            sold: item.quantity,
          },
        },
      },
    };
  });

  const invResult = await Product.bulkWrite(bulkInventoryOps, { session });

  if (invResult.modifiedCount !== cartItems.length) {
    throw new AppError(
      'Stock changed during checkout. Please review your cart and try again.',
      HTTP_STATUS.CONFLICT,
    );
  }
}
