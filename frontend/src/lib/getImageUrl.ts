import type { Image } from "@/types/productType";

type ImageVariant = "thumbnail" | "mobile" | "full";

function withCloudinaryOptimizations(url: string): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  if (url.includes("f_auto") || url.includes("q_auto")) return url; // already optimized
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "limit" | "fill" | "lpad";
}

export function getCloudinaryTransformedUrl(
  url: string,
  options: CloudinaryTransformOptions = {},
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const transforms = ["f_auto", "q_auto"];

  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);

  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
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

export function getResponsiveImageUrl(
  image: Image | undefined | null,
  width: number,
  fallback = "/placeholder.svg",
  crop: CloudinaryTransformOptions["crop"] = "limit",
): string {
  if (!image?.secureUrl) return fallback;

  return getCloudinaryTransformedUrl(image.secureUrl, {
    width,
    crop,
  });
}
