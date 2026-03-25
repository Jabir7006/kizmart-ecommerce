import { BannerModel, type BannerStatus, type BannerType } from '../models/banner.model.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import type { IImage } from '../models/product.model.js';
import { UploadService } from './upload.service.js';

export const createBanner = async (data: {
  image: IImage;
  link: string;
  status?: BannerStatus;
  displayOrder?: number;
  type?: BannerType;
  startDate?: Date;
  endDate?: Date;
}) => {
  const banner = await BannerModel.create(data);
  return banner;
};

export const getAllBanners = async (filter?: Record<string, any>) => {
  const query = filter || {};
  const banners = await BannerModel.find(query).sort({ displayOrder: 1, createdAt: -1 });
  return banners;
};

export const getBannerById = async (id: string) => {
  const banner = await BannerModel.findById(id);
  if (!banner) {
    throw new AppError('Banner not found', HTTP_STATUS.NOT_FOUND);
  }
  return banner;
};

export const updateBanner = async (
  id: string,
  data: Partial<{
    image: IImage;
    link: string;
    status: BannerStatus;
    displayOrder: number;
    type: BannerType;
    startDate: Date;
    endDate: Date;
  }>,
) => {
  const existing = await BannerModel.findById(id);
  if (!existing) {
    throw new AppError('Banner not found', HTTP_STATUS.NOT_FOUND);
  }

  // If a new image is provided, delete the old one from Cloudinary
  if (data.image && data.image.publicId && data.image.publicId !== existing.image.publicId) {
    await UploadService.deleteImage(existing.image.publicId);
  }

  const banner = await BannerModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!banner) {
    throw new AppError('Banner not found', HTTP_STATUS.NOT_FOUND);
  }
  return banner;
};

export const deleteBanner = async (id: string) => {
  const banner = await BannerModel.findByIdAndDelete(id);
  if (!banner) {
    throw new AppError('Banner not found', HTTP_STATUS.NOT_FOUND);
  }

  // Clean up image from Cloudinary
  if (banner.image?.publicId) {
    await UploadService.deleteImage(banner.image.publicId);
  }

  return banner;
};

