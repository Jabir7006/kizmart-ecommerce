import type { BaseResource, BaseResourceInput } from "./baseType";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CategoryInput extends BaseResourceInput {}

export interface Category extends CategoryInput, BaseResource {}
