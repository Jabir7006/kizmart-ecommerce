import { HTTP_STATUS } from '../constants/http.js';
import {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from '../services/address.service.js';
import catchAsync from '../utils/catchAsync.js';

export const handleCreateAddress = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const address = await createAddress(userId, req.body);

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message: 'Address created successfully',
    data: address,
  });
});

export const handleGetAddresses = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const addresses = await getUserAddresses(userId);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: addresses,
  });
});

export const handleGetAddressById = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const address = await getAddressById(req.params.id as string, userId);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: address,
  });
});

export const handleUpdateAddress = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const address = await updateAddress(req.params.id as string, userId, req.body);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Address updated successfully',
    data: address,
  });
});

export const handleDeleteAddress = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  await deleteAddress(req.params.id as string, userId);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Address deleted successfully',
  });
});
