import type { AxiosResponse } from "axios";
import api from "../api";

export type CreateOrderPayload = {
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
  };
  paymentMethod: "cash_on_delivery";
};

export const createOrder = (
  payload: CreateOrderPayload,
): Promise<AxiosResponse<any>> => {
  return api.post("/orders", payload);
};
