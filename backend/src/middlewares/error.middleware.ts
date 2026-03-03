/* eslint-disable no-console */
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import AppError from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/http.js';
import { NODE_ENV } from '../constants/env.js';

export const errorHandler = (
  err: Error | AppError | ZodError | any, 
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
      ...(err.errors && { errors: err.errors }),
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    const message = formattedErrors.map((e) => e.message).join(', ');

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: message,
      errors: formattedErrors,
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

  if ('code' in err && err.code === 11000) {
    const mongoErr = err as { keyValue?: Record<string, unknown> };
    const field = Object.keys(mongoErr.keyValue || {})[0];
    const value = field ? mongoErr.keyValue?.[field] : 'unknown';
    
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      status: HTTP_STATUS.CONFLICT,
      message: `${field || 'Field'} '${value}' already exists.`,
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
