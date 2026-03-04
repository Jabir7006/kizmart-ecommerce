import { Schema, model, Document, Types } from 'mongoose';

export interface IImage {
  publicId: string;
  secureUrl: string;
  altText: string;
}

const ImageSchema = new Schema(
  {
    publicId: { type: String, required: true },
    secureUrl: { type: String, required: true },
    altText: { type: String, default: '' },
  },
  { _id: false },
);

export interface IProduct extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  thumbnail: IImage;
  gallery: IImage[];
  price: number;
  quantity: number;
  sold: number;
  category: Types.ObjectId;
  brand: Types.ObjectId;
  status: 'draft' | 'active' | 'archived';
  ratings: number;
  numReviews: number;
  isFeatured: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    shortDescription: { type: String, required: true, trim: true },
    longDescription: { type: String, required: true },
    thumbnail: { type: ImageSchema, required: true },
    gallery: [ImageSchema],
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
    },
    sold: { type: Number, default: 0 },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
    },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

ProductSchema.index(
  { title: 'text', shortDescription: 'text' },
  { weights: { title: 10, shortDescription: 5 } },
);

const Product = model<IProduct>('Product', ProductSchema);
export default Product;
