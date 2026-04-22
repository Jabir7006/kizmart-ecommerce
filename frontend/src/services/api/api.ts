import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// 1. Create the Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Variables to handle concurrent requests during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 2. Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      const authRoutes = [
        "/auth/refresh",
        "/auth/signin",
        "/auth/signup",
        "/auth/verify-email",
        "/auth/resend-verification-email",
        "/auth/signout",
      ];

      const isAuthRoute = authRoutes.some((route) =>
        originalRequest.url?.includes(route),
      );

      // Jodi auth route e 401 khay, tahole ar kono retry korar dorkar nei
      if (isAuthRoute) {
        return Promise.reject(error);
      }

      // If a refresh is already in progress, queue the subsequent requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Backend theke notun token anlam (Cookies te automatically set hobe)
        await api.post("/auth/refresh");

        isRefreshing = false;
        processQueue(null);

        // Retry the original failed request
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError as AxiosError, null);

        useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      }
    }

    // For all other errors (or if retry is true), reject the promise
    return Promise.reject(error);
  },
);

export default api;
