import type { AddressFormData } from "@/types/addressType";
import api from "../api";

export const createAddress = async (data : AddressFormData) => await api.post('/addresses/add', data);
export const getAddresses = async () => await api.get('/addresses');
export const getAddressById = async (id : string) => await api.get(`/addresses/${id}`);
export const updateAddress = async (id : string, data : Partial<AddressFormData>) => await api.put(`/addresses/${id}`, data);
export const deleteAddress = async (id : string) => await api.delete(`/addresses/${id}`);
