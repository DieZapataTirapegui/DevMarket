import axios from "axios";

/**
 * Cliente Axios base para toda la app
 */
export const api = axios.create({
  baseURL: "http://localhost:3000", // backend NestJS
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor para agregar automáticamente el JWT
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Interceptor de respuestas (manejo de errores global)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);

      if (error.response.status === 401) {
        // token inválido o expirado
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else {
      console.error("Network Error:", error);
    }

    return Promise.reject(error);
  }
);