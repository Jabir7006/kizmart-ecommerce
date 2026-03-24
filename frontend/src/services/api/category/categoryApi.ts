import type { CategoryInput } from "@/types/categoryType";
import api from "../api";

export const getCategories = async () => api.get("/categories");

export const getCategory = async (id: string) => api.get(`/categories/${id}`);

export const createCategory = async (data: CategoryInput) =>
  api.post("/categories/create", data);

export const updateCategory = async (
  id: string,
  data: Partial<CategoryInput>,
) => api.put(`/categories/${id}`, data);

export const deleteCategory = async (id: string) =>
  api.delete(`/categories/${id}`);
