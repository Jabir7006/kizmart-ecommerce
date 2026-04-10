import { Document, Schema, Types, model } from 'mongoose';

export interface CartItem extends Document {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface Cart extends Document {
  user: Types.ObjectId;
  items: CartItem[];
  totalPrice: number;
  status: 'active' | 'ordered' | 'abandoned';
}

const cartItemSchema = new Schema<CartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const cartSchema = new Schema<Cart>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'ordered', 'abandoned'],
      default: 'active',
    },
  },
  { timestamps: true },
);

cartSchema.pre('save', function () {
  return (this.totalPrice = Math.round(
    this.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0)
  ));
});

export const Cart = model<Cart>('Cart', cartSchema);
