import type { Address } from "@/types/addressType";
import api from "../api";

export const createAddress = async (data : Address) => await api.post('/addresses/add', data);
export const getAddresses = async () => await api.get('/addresses');
export const getAddressById = async (id : string) => await api.get(`/addresses/${id}`);
export const updateAddress = async (id : string, data : Address) => await api.put(`/addresses/${id}`, data);
export const deleteAddress = async (id : string) => await api.delete(`/addresses/${id}`);
