// src/api/axios.js
import axios from "axios";

// 1. Define the base URL using an Environment Variable
// This is critical for switching between development and production environments
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// 2. Request Interceptor for Authentication
// This automatically adds the Authorization token to every single request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // e.g., using JWTs
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor for Global Error/Auth Handling
// This can handle responses like 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logic to log the user out, clear storage, and redirect to the login page
      console.log("Unauthorized request. Redirecting to login.");
      // e.g., logoutUserAndRedirect();
    }
    return Promise.reject(error);
  }
);

export default api;
