import { BannerModel, type BannerStatus, type BannerType } from '../models/banner.model.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import type { IImage } from '../models/product.model.js';

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
  if (!banners || banners.length === 0) {
    throw new AppError('No banners found', HTTP_STATUS.NOT_FOUND);
  }
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
  return banner;
};
