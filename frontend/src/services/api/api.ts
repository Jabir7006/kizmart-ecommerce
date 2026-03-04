import axios, { AxiosError } from 'axios';

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

const processQueue = (error: AxiosError | null, token: string | null = null) => {
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
      
      // Prevent infinite loops if the refresh token endpoint itself fails
      if (originalRequest.url.includes('/refresh-token')) {
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
        await api.post('/auth/refresh'); 
        
        isRefreshing = false;
        processQueue(null);

        // Retry the original failed request
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError as AxiosError, null);
        
        // If the refresh token fails (e.g., it expired), force the user to log in again
        window.location.href = '/signin'; 
        
        return Promise.reject(refreshError);
      }
    }

    // For all other errors (or if retry is true), reject the promise
    return Promise.reject(error);
  }
);

export default api;