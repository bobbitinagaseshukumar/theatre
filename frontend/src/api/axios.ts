import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
