import type { IImage } from '../models/product.model.js';
import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';
import type {
  UploadApiErrorResponse,
  UploadApiResponse,
  UploadApiOptions,
} from 'cloudinary';

const CLOUDINARY_ROOT_FOLDER = 'kizmart';

const BASE_UPLOAD_OPTIONS: UploadApiOptions = {
  resource_type: 'image',
  format: 'webp',
  quality: 'auto',
  crop: 'limit',
};

const CATEGORY_CONFIGS: Record<string, UploadApiOptions> = {
  banners: {
    width: 1920,
    eager: [{ width: 768, crop: 'limit', format: 'webp', quality: 'auto' }],
  },
  hero: {
    width: 1920,
    eager: [{ width: 768, crop: 'limit', format: 'webp', quality: 'auto' }],
  },
  avatars: { width: 250 },
  thumbnails: { width: 400 },
  galleries: { width: 1000 },
  products: { width: 1000 },
};

const DEFAULT_CONFIG: UploadApiOptions = { width: 800 };

export class UploadService {
  static async uploadImage(
    fileBuffer: Buffer,
    folderName: string,
    originalName?: string,
  ): Promise<IImage> {
    return new Promise((resolve, reject) => {
      const categoryConfig = CATEGORY_CONFIGS[folderName] || DEFAULT_CONFIG;

      const options: UploadApiOptions = {
        ...BASE_UPLOAD_OPTIONS,
        ...categoryConfig,
        folder: `${CLOUDINARY_ROOT_FOLDER}/${folderName}`,
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
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
            mobileUrl:
              result.eager && result.eager.length > 0
                ? result.eager[0].secure_url
                : undefined,
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
