import api from "../api";

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData extends SignInData {
  fullName: string;
}

export const signUp = async (credentials: SignUpData) =>
  api.post("/auth/signup", credentials);

export const signIn = async (credentials: SignInData) =>
  api.post("/auth/signin", credentials);

export const verifyEmail = async (code: string) =>
  api.post("/auth/verify-email", { code });

export const resendVerificationEmail = async () =>
  api.post("/auth/resend-verification-email");
