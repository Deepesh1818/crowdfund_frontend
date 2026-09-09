import axios from 'axios';

// Attach token to standard axios requests if available
axios.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND, // No need to add `/api` if not used in routes
  withCredentials: true, // Ensures cookies are sent with every request
});

instance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
