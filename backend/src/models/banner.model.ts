import { model, Schema, type Document } from 'mongoose';
import { ImageSchema, type IImage } from './product.model.js';

export const BANNER_TYPES = ['banner', 'promo', 'offer'] as const;
export type BannerType = typeof BANNER_TYPES[number];

export const BANNER_STATUSES = ['active', 'inactive'] as const;
export type BannerStatus = typeof BANNER_STATUSES[number];

export interface Banner extends Document {
  image: IImage;
  link: string;
  status: BannerStatus;
  displayOrder: number;
  type: BannerType;
  startDate?: Date;
  endDate?: Date;
}

const bannerSchema = new Schema<Banner>(
  {
    image: {
      type: ImageSchema,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: BANNER_STATUSES,
      default: 'active',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: BANNER_TYPES,
      default: 'banner',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
      validate: [
        function (this: Banner, value: Date) {
          if (this.startDate && value) {
            return value > this.startDate;
          }
          return true;
        },
        'End date must be after the start date.',
      ],
    },
  },
  { timestamps: true },
);

bannerSchema.index({ status: 1, displayOrder: 1 });

export const BannerModel = model<Banner>('Banner', bannerSchema);
