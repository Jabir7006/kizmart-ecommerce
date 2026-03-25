import slugify from 'slugify';
import Category from '../models/category.model.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import type { ImageType } from '../types/image.types.js';
import { UploadService } from './upload.service.js';

export const createCategory = async (data: {
  title: string;
  thumbnail?: ImageType;
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
  const existingCategory = await Category.findById(id);

  if (!existingCategory) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }

  const updateData: Record<string, any> = { ...data };
  if (data.title) {
    // @ts-expect-error slugify types are not compatible with typescript
    updateData.slug = slugify(data.title, { lower: true });
  }

  if (data.thumbnail && data.thumbnail.publicId) {
    // New image uploaded — delete the old one from Cloudinary and save the new one
    const existingThumbnail = existingCategory.thumbnail;
    if (existingThumbnail) {
      await UploadService.deleteImage(existingThumbnail.publicId);
    }
    updateData.thumbnail = data.thumbnail;
  } else if (data.thumbnail === null) {
    // Thumbnail explicitly removed — delete from Cloudinary and clear in DB
    const existingThumbnail = existingCategory.thumbnail;
    if (existingThumbnail) {
      await UploadService.deleteImage(existingThumbnail.publicId);
    }
    updateData.thumbnail = null;
  } else {
    // thumbnail is undefined — preserve the existing value; remove from updateData
    delete updateData.thumbnail;
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

  const thumbnail = category.thumbnail;
  if (thumbnail) {
    await UploadService.deleteImage(thumbnail.publicId);
  }
  return category;
};
