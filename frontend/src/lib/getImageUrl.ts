import type { Image } from "@/types/productType";

type ImageVariant = "thumbnail" | "mobile" | "full";

function withCloudinaryOptimizations(url: string): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  if (url.includes("f_auto") || url.includes("q_auto")) return url; // already optimized
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

export function getImageUrl(
  image: Image | undefined | null,
  variant: ImageVariant,
  fallback = "/placeholder.svg",
): string {
  if (!image) return fallback;

  let url: string;
  switch (variant) {
    case "thumbnail":
      url = image.thumbnailUrl ?? image.mobileUrl ?? image.secureUrl;
      break;
    case "mobile":
      url = image.mobileUrl ?? image.secureUrl;
      break;
    case "full":
    default:
      url = image.secureUrl;
  }

  return withCloudinaryOptimizations(url);
}
