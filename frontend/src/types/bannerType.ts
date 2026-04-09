import type { BaseEntity } from './baseType';
import type { Image } from './productType';

export type BannerType = 'banner' | 'promo' | 'offer';
export type BannerStatus = 'active' | 'inactive';

export const BANNER_TYPES: BannerType[] = ['banner', 'promo', 'offer'];
export const BANNER_STATUSES: BannerStatus[] = ['active', 'inactive'];

export interface Banner extends BaseEntity {
  image: Image;
  link: string;
  status: BannerStatus;
  displayOrder: number;
  type: BannerType;
  startDate?: string;
  endDate?: string;
}
