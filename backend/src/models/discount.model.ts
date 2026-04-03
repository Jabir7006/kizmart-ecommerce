import { Document, model, Schema, Types } from 'mongoose';

export interface IDiscount extends Document {
  name: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  targetType: 'product' | 'category' | 'all';
  targetProducts: Types.ObjectId[];
  targetCategories: Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const discountSchema = new Schema<IDiscount>(
  {
    name: { type: String, required: true },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    value: { type: Number, required: true },
    targetType: {
      type: String,
      enum: ['product', 'category', 'all'],
      required: true,
    },
    targetProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    targetCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

discountSchema.index({ name: 1, isActive: 1, startDate: 1, endDate: 1 });
discountSchema.index({ discountType: 1, targetType: 1 });

export default model<IDiscount>('Discount', discountSchema);
