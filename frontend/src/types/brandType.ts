import type { Image } from "./productType";

export interface BrandInput {
  title: string;
  slug: string;
  logo?: Image;
}

export interface Brand extends BrandInput {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}
