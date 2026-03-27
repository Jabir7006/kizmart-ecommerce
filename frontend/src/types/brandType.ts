import type { Image } from "./productType";
import type { BaseResource } from "./baseType";

export interface BrandInput {
  title: string;
  slug: string;
  logo?: Image;
}

export interface Brand extends BrandInput, Omit<BaseResource, "thumbnail"> {}
