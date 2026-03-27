import type { Image } from "./productType";

export interface BaseResourceInput {
  title: string;
  slug: string;
  thumbnail?: Image;
}

export interface BaseResource extends BaseResourceInput {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}
