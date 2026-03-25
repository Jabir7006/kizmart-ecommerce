import type { Image } from '@/types/productType';

type ImageVariant = 'thumbnail' | 'mobile' | 'full';

/**
 * Returns the best image URL for the given display context.
 *
 * - 'thumbnail' → ~200px  (product card, admin list row)
 * - 'mobile'    → ~500px  (medium displays, gallery thumbs)
 * - 'full'      → up to 1000px (main product image, zoom)
 *
 * Falls back gracefully for images uploaded before thumbnailUrl existed.
 */
export function getImageUrl(
  image: Image | undefined | null,
  variant: ImageVariant,
  fallback = '/placeholder.svg',
): string {
  if (!image) return fallback;

  switch (variant) {
    case 'thumbnail':
      return image.thumbnailUrl ?? image.mobileUrl ?? image.secureUrl;
    case 'mobile':
      return image.mobileUrl ?? image.secureUrl;
    case 'full':
    default:
      return image.secureUrl;
  }
}
