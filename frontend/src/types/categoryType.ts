import type { Image } from "./productType";

export interface CategoryInput {
  title: string;
  slug: string;
  thumbnail?: Image;
}

export interface Category extends CategoryInput {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}
