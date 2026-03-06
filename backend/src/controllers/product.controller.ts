import { HTTP_STATUS } from '../constants/http.js';
import { createProduct, getAllProducts } from '../services/product.service.js';
import type { ProductQueryOptions } from '../types/product.types.js';
import catchAsync from '../utils/catchAsync.js';

export const handleCreateProduct = catchAsync(async (req, res) => {
  const {
    title,
    shortDescription,
    longDescription,
    thumbnail,
    gallery,
    price,
    quantity,
    category,
    brand,
    status,
    isFeatured,
  } = req.body;

  const data = {
    title,
    shortDescription,
    longDescription,
    thumbnail,
    gallery,
    price,
    quantity,
    category,
    brand,
    status,
    isFeatured,
  };

  const product = await createProduct(data);

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message: 'Product created successfully',
    data: product,
  });
});

export const handleGetAllProducts = catchAsync(async (req, res) => {
  const options: ProductQueryOptions = {
    search: req.query.q as string,
    categorySlug: req.query.categorySlug as string,
    brandSlug: req.query.brandSlug as string,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
    page: req.query.page ? Math.max(1, Number(req.query.page)) : 1,
    limit: req.query.limit ? Math.max(1, Number(req.query.limit)) : 10,
  };

  const paginatedResults = await getAllProducts(options);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: paginatedResults,
  });
});
