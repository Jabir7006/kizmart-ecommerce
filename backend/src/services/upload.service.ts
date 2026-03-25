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
  quality: 'auto',
  fetch_format: 'auto',
  crop: 'limit',
  flags: 'progressive',
};

const FOLDER_CONFIGS: Record<string, UploadApiOptions> = {
  banners: {
    width: 1920,
    quality: 'auto:good',
    eager: [{ width: 768, crop: 'limit' }],
  },

  hero: {
    width: 1920,
    quality: 'auto:good',
    eager: [{ width: 768, crop: 'limit' }],
  },

  avatars: {
    width: 250,
    height: 250,
    crop: 'fill',
    gravity: 'face',
  },

  thumbnails: {
    width: 400,
    height: 400,
    crop: 'fill',
  },

  products: {
    width: 1200,
    crop: 'limit',
    quality: 'auto:good',
    eager: [
      { width: 800, crop: 'limit' },
      { width: 400, crop: 'limit' },
    ],
  },

  galleries: {
    width: 1400,
    crop: 'limit',
    quality: 'auto:eco',
  },
};

const DEFAULT_CONFIG: UploadApiOptions = {
  width: 800,
};

function sanitizeAltText(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export class UploadService {
  static async uploadImage(
    fileBuffer: Buffer,
    folderName: string,
    originalName?: string,
  ): Promise<IImage> {
    return new Promise((resolve, reject) => {
      const folderConfig = FOLDER_CONFIGS[folderName] || DEFAULT_CONFIG;

      const options: UploadApiOptions = {
        ...BASE_UPLOAD_OPTIONS,
        ...folderConfig,
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
            thumbnailUrl:
              result.eager && result.eager.length > 1
                ? result.eager[1].secure_url
                : undefined,
            altText: originalName
              ? sanitizeAltText(originalName)
              : 'Uploaded image',
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
