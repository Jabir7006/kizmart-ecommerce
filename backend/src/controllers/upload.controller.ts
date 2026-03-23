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

export const uploadMultipleImage = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw new AppError('No file providerd', HTTP_STATUS.BAD_REQUEST);
  }

  const folder = req.body.folder || 'galleries';

  const uploadPromises = files.map((file) =>
    UploadService.uploadImage(file.buffer, folder, file.originalname),
  );

  const settledResults = await Promise.allSettled(uploadPromises);
  const imageObjects = settledResults
    .filter((result) => result.status === 'fulfilled')
    .map((result) => (result as PromiseFulfilledResult<IImage>).value);

  if (imageObjects.length === 0) {
    throw new AppError('All file uploads failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: imageObjects.length === files.length 
      ? 'Images uploaded successfully' 
      : `${imageObjects.length} out of ${files.length} images uploaded successfully`,
    data: imageObjects,
  });
});
