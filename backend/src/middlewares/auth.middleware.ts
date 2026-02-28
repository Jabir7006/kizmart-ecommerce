import { ACCESS_TOKEN_SECRET } from '../constants/env.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { verifyToken } from '../utils/jwt.js';

export const protect = catchAsync(async (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;

  if (!accessToken) {
    throw new AppError(
      'Not authorized : no token provided',
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const decoded = verifyToken(accessToken, { secret: ACCESS_TOKEN_SECRET });

  req.user = decoded;
  next();
});
