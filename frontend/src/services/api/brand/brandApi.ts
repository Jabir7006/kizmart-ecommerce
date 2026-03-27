import type { BrandInput } from "@/types/brandType";
import api from "../api";

export const getBrands = async () => api.get("/brands");

export const getBrand = async (id: string) => api.get(`/brands/${id}`);

export const createBrand = async (data: BrandInput) =>
  api.post("/brands/create", data);

export const updateBrand = async (id: string, data: Partial<BrandInput>) =>
  api.put(`/brands/${id}`, data);

export const deleteBrand = async (id: string) => api.delete(`/brands/${id}`);
