import {
  uploadSingleImage,
  uploadMultipleImage,
} from "@/services/api/upload/uploadApi";
import type { Image } from "@/types/productType";

export const processProductImages = async ({
  thumbnail,
  gallery = [],
}: {
  thumbnail: File | Image | undefined;
  gallery?: (File | Image)[];
}): Promise<{
  thumbnailData: Image;
  galleryData: Image[];
}> => {
  // ─── Thumbnail ─────────────────────────────────────────────────────────────
  if (!thumbnail) throw new Error("Thumbnail is required");

  let thumbnailData: Image;
  if (thumbnail instanceof File) {
    const res = await uploadSingleImage(thumbnail, "products");
    thumbnailData = res.data.data;
  } else {
    thumbnailData = thumbnail;
  }

  // ─── Gallery ───────────────────────────────────────────────────────────────
  const newFiles = gallery.filter((item) => item instanceof File) as File[];
  const existingImages = gallery.filter(
    (item) => !(item instanceof File),
  ) as Image[];

  let galleryData: Image[] = existingImages;
  if (newFiles.length > 0) {
    const res = await uploadMultipleImage(newFiles, "galleries");
    galleryData = [...existingImages, ...res.data.data];
  }

  return { thumbnailData, galleryData };
};
