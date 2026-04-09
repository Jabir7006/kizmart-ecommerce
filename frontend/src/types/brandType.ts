import type { BaseEntity } from "./baseType";
import type { Image } from "./productType";

export interface BrandInput {
  title: string;
  slug: string;
  logo?: Image;
}

export interface Brand extends BaseEntity, BrandInput {}
