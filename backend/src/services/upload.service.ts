import type { IImage } from '../models/product.model.js';
import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';

export class UploadService {
  static async uploadImage(
    fileBuffer: Buffer,
    folderName: string,
    originalName?: string,
  ): Promise<IImage> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `kizmart/${folderName}`,
          resource_type: 'image',
          format: 'webp',
          quality: 'auto',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(
              new AppError('Unknown error occurred during Cloudinary upload'),
            );
          }

          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
            altText: originalName?.split('.')[0] || 'Uploaded image',
          });
        },
      );

      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Deletes an image from Cloudinary
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error(`Failed to delete image with publicId: ${publicId}`, error);
      return false;
    }
  }
}
