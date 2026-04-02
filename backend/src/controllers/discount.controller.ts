import { HTTP_STATUS } from '../constants/http.js';
import {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
} from '../services/discount.service.js';
import catchAsync from '../utils/catchAsync.js';

export const handleCreateDiscount = catchAsync(async (req, res) => {
  const { discount, syncedCount } = await createDiscount(req.body);

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message: `Discount created — ${syncedCount} product(s) updated`,
    data: discount,
  });
});

export const handleGetAllDiscounts = catchAsync(async (_req, res) => {
  const discounts = await getAllDiscounts();

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: discounts,
  });
});

export const handleGetDiscountById = catchAsync(async (req, res) => {
  const discount = await getDiscountById(req.params.id as string);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: discount,
  });
});

export const handleUpdateDiscount = catchAsync(async (req, res) => {
  const { discount, syncedCount } = await updateDiscount(
    req.params.id as string,
    req.body,
  );

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: `Discount updated — ${syncedCount} product(s) synced`,
    data: discount,
  });
});

export const handleDeleteDiscount = catchAsync(async (req, res) => {
  const { revertedCount } = await deleteDiscount(req.params.id as string);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: `Discount deleted — ${revertedCount} product(s) reverted`,
  });
});

export const handleToggleDiscountStatus = catchAsync(async (req, res) => {
  const result = await toggleDiscountStatus(req.params.id as string);

  const isNowActive = result.discount.isActive;
  const count = isNowActive
    ? (result as any).syncedCount
    : (result as any).revertedCount;

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: isNowActive
      ? `Discount activated — ${count} product(s) updated`
      : `Discount deactivated — ${count} product(s) reverted`,
    data: result.discount,
  });
});
