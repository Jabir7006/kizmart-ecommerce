import slugify from 'slugify';
import Brand from '../models/brand.model.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import type { ImageType } from '../types/image.types.js';
import { UploadService } from './upload.service.js';

export const createBrand = async (data: {
  title: string;
  logo?: ImageType;
}) => {
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
  const existingBrand = await Brand.findById(id);

  if (!existingBrand) {
    throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND);
  }

  const updateData: Record<string, any> = { ...data };
  if (data.title) {
    // @ts-expect-error slugify types are not compatible with typescript
    updateData.slug = slugify(data.title, { lower: true });
  }

  if (data.logo && data.logo.publicId) {
    const existingLogo = existingBrand.logo;
    if (existingLogo) {
      await UploadService.deleteImage(existingLogo.publicId);
    }
    updateData.logo = data.logo;
  } else if (data.logo === null) {
    const existingLogo = existingBrand.logo;
    if (existingLogo) {
      await UploadService.deleteImage(existingLogo.publicId);
    }
    updateData.logo = null;
  } else {
    delete updateData.logo;
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

  const logo = brand.logo;
  if (logo) {
    await UploadService.deleteImage(logo.publicId);
  }
  return brand;
};
