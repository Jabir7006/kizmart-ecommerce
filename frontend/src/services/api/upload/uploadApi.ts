import api from "../api";

export const uploadSingleImage = async (
  file: File,
  folder: string = "thumbnails",
) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  return api.post("/upload/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadMultipleImage = async (
  files: File[],
  folder: string = "galleries",
) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  formData.append("folder", folder);

  return api.post("/upload/multiple", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
