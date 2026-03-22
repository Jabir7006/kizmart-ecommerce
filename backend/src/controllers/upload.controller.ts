import { HTTP_STATUS } from '../constants/http.js';
import type { IImage } from '../models/product.model.js';
import { UploadService } from '../services/upload.service.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const uploadSingleImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file providerd', HTTP_STATUS.BAD_REQUEST);
  }

  const folder = req.body.folder || 'general';

  const image: IImage = await UploadService.uploadImage(
    req.file.buffer,
    folder,
    req.file.originalname,
  );

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Image uploaded successfully',
    data: image,
  });
});
