import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';

export const handleGetUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.user?.userId);

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: user,
  });
});
