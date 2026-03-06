import slugify from 'slugify';
import Brand from '../models/brand.model.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import type { ImageType } from '../types/image.types.js';

export const createBrand = async (data: { title: string; logo: ImageType }) => {
  const existing = await Brand.findOne({ title: data.title });
  if (existing) {
    throw new AppError('Brand already exists', HTTP_STATUS.CONFLICT);
  }

  const brand = await Brand.create({
    ...data,
    // @ts-expect-error slugify types are not compatible with typescript
    slug: slugify(data.title, { lower: true }),
  });
  return brand;
};

export const getAllBrands = async () => {
  const brands = await Brand.find();
  if (!brands || brands.length === 0) {
    throw new AppError('No brands found', HTTP_STATUS.NOT_FOUND);
  }
  return brands;
};

export const getBrandById = async (id: string) => {
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND);
  }
  return brand;
};

export const updateBrand = async (
  id: string,
  data: Partial<{
    title: string;
    logo: ImageType;
  }>,
) => {
  const updateData: Record<string, any> = { ...data };
  if (data.title) {
    // @ts-expect-error slugify types are not compatible with typescript
    updateData.slug = slugify(data.title, { lower: true });
  }

  const brand = await Brand.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!brand) {
    throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND);
  }
  return brand;
};

export const deleteBrand = async (id: string) => {
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND);
  }
  return brand;
};
