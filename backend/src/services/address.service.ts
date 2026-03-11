import Address from '../models/address.model.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import type { Types } from 'mongoose';

type AddressData = {
  fullName?: string;
  phoneNumber?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  isDefault?: boolean;
};

export const createAddress = async (userId: string | Types.ObjectId, data: AddressData) => {
  if (data.isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  } else {
    // If it's the first address, make it default
    const count = await Address.countDocuments({ user: userId });
    if (count === 0) {
      data.isDefault = true;
    }
  }

  const address = await Address.create({ ...data, user: userId });
  return address;
};

export const getUserAddresses = async (userId: string | Types.ObjectId) => {
  const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
  return addresses;
};

export const getAddressById = async (id: string, userId: string | Types.ObjectId) => {
  const address = await Address.findOne({ _id: id, user: userId });
  if (!address) {
    throw new AppError('Address not found', HTTP_STATUS.NOT_FOUND);
  }
  return address;
};

export const updateAddress = async (id: string, userId: string | Types.ObjectId, data: AddressData) => {
  if (data.isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }

  const address = await Address.findOneAndUpdate({ _id: id, user: userId }, data, {
    new: true,
    runValidators: true,
  });

  if (!address) {
    throw new AppError('Address not found', HTTP_STATUS.NOT_FOUND);
  }
  return address;
};

export const deleteAddress = async (id: string, userId: string | Types.ObjectId) => {
  const address = await Address.findOneAndDelete({ _id: id, user: userId });
  if (!address) {
    throw new AppError('Address not found', HTTP_STATUS.NOT_FOUND);
  }
  return address;
};
