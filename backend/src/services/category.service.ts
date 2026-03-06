import slugify from 'slugify';
import Category from '../models/category.model.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import type { ImageType } from '../types/image.types.js';

export const createCategory = async (data: {
  title: string;
  thumbnail: ImageType;
}) => {
  const existing = await Category.findOne({ title: data.title });
  if (existing) {
    throw new AppError('Category already exists', HTTP_STATUS.CONFLICT);
  }

  const category = await Category.create({
    ...data,
    // @ts-expect-error slugify types are not compatible with typescript
    slug: slugify(data.title, { lower: true }),
  });
  return category;
};

export const getAllCategories = async () => {
  const categories = await Category.find();
  if (!categories || categories.length === 0) {
    throw new AppError('No categories found', HTTP_STATUS.NOT_FOUND);
  }
  return categories;
};

export const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }
  return category;
};

export const updateCategory = async (
  id: string,
  data: Partial<{
    title: string;
    thumbnail: ImageType;
  }>,
) => {
  const updateData: Record<string, any> = { ...data };
  if (data.title) {
    // @ts-expect-error slugify types are not compatible with typescript
    updateData.slug = slugify(data.title, { lower: true });
  }

  const category = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }
  return category;
};

export const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }
  return category;
};
