import { HTTP_STATUS } from '../constants/http.js';
import {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from '../services/banner.service.js';
import catchAsync from '../utils/catchAsync.js';

export const handleCreateBanner = catchAsync(async (req, res) => {
  const banner = await createBanner(req.body);

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message: 'Banner created successfully',
    data: banner,
  });
});

export const handleGetAllBanners = catchAsync(async (req, res) => {
  // Allow filtering active banners query param
  const filter: Record<string, any> = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.type) {
    filter.type = req.query.type;
  }

  const banners = await getAllBanners(filter);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: banners,
  });
});

export const handleGetBannerById = catchAsync(async (req, res) => {
  const banner = await getBannerById(req.params.id as string);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: banner,
  });
});

export const handleUpdateBanner = catchAsync(async (req, res) => {
  const banner = await updateBanner(req.params.id as string, req.body);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Banner updated successfully',
    data: banner,
  });
});

export const handleDeleteBanner = catchAsync(async (req, res) => {
  await deleteBanner(req.params.id as string);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Banner deleted successfully',
  });
});
