import type { Image } from "./productType";

export interface Category {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: Image;
  createdAt?: string;
  updatedAt?: string;
}
