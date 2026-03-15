import { Document, Schema, Types, model } from 'mongoose';
import { applyGlobalTransform } from '../utils/mongoose.js';

export type PaymentMethod = 'cash_on_delivery';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IPayment extends Document {
  order?: Types.ObjectId;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    method: {
      type: String,
      enum: ['cash_on_delivery'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
  },
  { timestamps: true },
);

paymentSchema.plugin(applyGlobalTransform);

const Payment = model<IPayment>('Payment', paymentSchema);

export default Payment;
