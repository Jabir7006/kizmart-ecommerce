import type { addressSchema } from "@/schemas/addressSchema";
import { z } from "zod";

export interface Address {
  _id: string;
  user: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

export type AddressFormData = z.infer<typeof addressSchema>;
