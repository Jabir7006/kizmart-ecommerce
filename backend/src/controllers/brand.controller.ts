import { HTTP_STATUS } from '../constants/http.js';
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from '../services/brand.service.js';
import catchAsync from '../utils/catchAsync.js';

export const handleCreateBrand = catchAsync(async (req, res) => {
  const { title, logo } = req.body;
  const brand = await createBrand({ title, logo });

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message: 'Brand created successfully',
    data: brand,
  });
});

export const handleGetAllBrands = catchAsync(async (req, res) => {
  const brands = await getAllBrands();

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: brands,
  });
});

export const handleGetBrandById = catchAsync(async (req, res) => {
  const brand = await getBrandById(req.params.id as string);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: brand,
  });
});

export const handleUpdateBrand = catchAsync(async (req, res) => {
  const brand = await updateBrand(req.params.id as string, req.body);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Brand updated successfully',
    data: brand,
  });
});

export const handleDeleteBrand = catchAsync(async (req, res) => {
  await deleteBrand(req.params.id as string);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Brand deleted successfully',
  });
});
