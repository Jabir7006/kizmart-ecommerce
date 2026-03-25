import api from '../api';
import type { Banner } from '@/types/bannerType';

export const getBanners = (params?: Record<string, string>) =>
  api.get<{ status: string; data: Banner[] }>('/banners', { params });

export const getBanner = (id: string) =>
  api.get<{ status: string; data: Banner }>(`/banners/${id}`);

export const createBanner = (data: Partial<Banner>) =>
  api.post<{ status: string; data: Banner }>('/banners/create', data);

export const updateBanner = (id: string, data: Partial<Banner>) =>
  api.put<{ status: string; data: Banner }>(`/banners/${id}`, data);

export const deleteBanner = (id: string) =>
  api.delete<{ status: string }>(`/banners/${id}`);
