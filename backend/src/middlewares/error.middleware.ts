import type { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError..js';
import { HTTP_STATUS } from '../constants/http.js';
import { NODE_ENV } from '../constants/env.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Log error
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.statusCode,
      message: err.message,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: err.message,
    });
  }

  // Handle Mongoose cast errors
  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: 'Invalid ID format',
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      status: HTTP_STATUS.UNAUTHORIZED,
      message: 'Invalid token',
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      status: HTTP_STATUS.UNAUTHORIZED,
      message: 'Token expired',
    });
  }

  const isDevelopment = NODE_ENV === 'development';

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: isDevelopment ? err.message : 'Something went wrong',
    ...(isDevelopment && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    status: HTTP_STATUS.NOT_FOUND,
    message: `Route ${req.originalUrl} not found`,
  });
};
