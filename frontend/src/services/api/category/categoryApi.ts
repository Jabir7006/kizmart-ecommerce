import api from "../api";

export const getCategories = async () => api.get("/categories");
export const deleteCategory = async (id: string) => api.delete(`/categories/${id}`);
