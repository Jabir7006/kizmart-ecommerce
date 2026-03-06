import mongoose from 'mongoose';
import { ImageSchema, type IImage } from './product.model.js';

interface Category {
  title: string;
  slug: string;
  thumbnail?: IImage;
}

const categorySchema = new mongoose.Schema<Category>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    thumbnail: {
      type: ImageSchema,
    },
  },
  { timestamps: true },
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
