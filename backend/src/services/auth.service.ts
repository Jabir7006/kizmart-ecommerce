import { HTTP_STATUS } from '../constants/http.js';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';

type CreateUserData = {
  fullName: string;
  email: string;
  password: string;
};

export const createUser = async (data: CreateUserData) => {
  const existsUser = await User.findOne({ email: data.email });
  if (existsUser) {
    throw new AppError('User already exists', HTTP_STATUS.CONFLICT);
  }

  const user = await User.create(data);

  return user;
};
