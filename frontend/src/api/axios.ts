import axios from "axios";

// Configurable API base URL:
//   - Set VITE_API_URL in Vercel (e.g. https://api.yourdomain.com/api) for production
//   - Falls back to the local backend during development
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Automatically inject JWT token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cineverse_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
