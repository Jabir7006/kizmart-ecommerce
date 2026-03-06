import { HTTP_STATUS } from '../constants/http.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../services/category.service.js';
import catchAsync from '../utils/catchAsync.js';

export const handleCreateCategory = catchAsync(async (req, res) => {
  const { title, thumbnail } = req.body;
  const category = await createCategory({ title, thumbnail });

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message: 'Category created successfully',
    data: category,
  });
});

export const handleGetAllCategories = catchAsync(async (req, res) => {
  const categories = await getAllCategories();

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: categories,
  });
});

export const handleGetCategoryById = catchAsync(async (req, res) => {
  const category = await getCategoryById(req.params.id as string);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: category,
  });
});

export const handleUpdateCategory = catchAsync(async (req, res) => {
  const category = await updateCategory(req.params.id as string, req.body);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Category updated successfully',
    data: category,
  });
});

export const handleDeleteCategory = catchAsync(async (req, res) => {
  await deleteCategory(req.params.id as string);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Category deleted successfully',
  });
});
