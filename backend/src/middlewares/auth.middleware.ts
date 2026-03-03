import type { NextFunction, Request, Response } from 'express';
import { ACCESS_TOKEN_SECRET } from '../constants/env.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { verifyToken, type accessTokenPayload } from '../utils/jwt.js';

export const protect = catchAsync(async (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;

  if (!accessToken) {
    throw new AppError(
      'Not authorized : no token provided',
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const decoded = verifyToken(accessToken, { secret: ACCESS_TOKEN_SECRET }) as accessTokenPayload;

  req.user = decoded;
  next();
});


export const requireVerification = catchAsync(async (req, _res, next) => {
  if (!req.user) {
     throw new AppError('Not authorized', HTTP_STATUS.UNAUTHORIZED);
  }

  if (!req.user.verified) {
    throw new AppError(
      'Please verify your email address to perform this action.',
      HTTP_STATUS.FORBIDDEN
    );
  }

  next();
});

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        HTTP_STATUS.FORBIDDEN,
      );
    }
    next();
  };
};