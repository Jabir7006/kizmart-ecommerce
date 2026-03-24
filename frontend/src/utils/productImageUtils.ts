import {
  uploadSingleImage,
  uploadMultipleImage,
} from "@/services/api/upload/uploadApi";

type ImageObject = { publicId: string; secureUrl: string };

export const processProductImages = async ({
  thumbnail,
  gallery = [],
}: {
  thumbnail: File | ImageObject | undefined;
  gallery?: (File | ImageObject)[];
}): Promise<{
  thumbnailData: ImageObject;
  galleryData: ImageObject[];
}> => {
  // ─── Thumbnail ─────────────────────────────────────────────────────────────
  if (!thumbnail) throw new Error("Thumbnail is required");

  let thumbnailData: ImageObject;
  if (thumbnail instanceof File) {
    const res = await uploadSingleImage(thumbnail, "thumbnails");
    thumbnailData = res.data.data;
  } else {
    thumbnailData = thumbnail;
  }

  // ─── Gallery ───────────────────────────────────────────────────────────────
  const newFiles = gallery.filter((item) => item instanceof File) as File[];
  const existingImages = gallery.filter(
    (item) => !(item instanceof File),
  ) as ImageObject[];

  let galleryData: ImageObject[] = existingImages;
  if (newFiles.length > 0) {
    const res = await uploadMultipleImage(newFiles, "galleries");
    galleryData = [...existingImages, ...res.data.data];
  }

  return { thumbnailData, galleryData };
};
