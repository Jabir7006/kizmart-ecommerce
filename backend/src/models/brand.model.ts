import mongoose from 'mongoose';
import { ImageSchema, type IImage } from './product.model.js';

interface Brand {
  title: string;
  slug: string;
  logo?: IImage;
}
const brandSchema = new mongoose.Schema<Brand>({
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
  logo: {
    type: ImageSchema,
    required: true,
  },
});

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
