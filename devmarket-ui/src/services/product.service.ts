import { api } from "./api";

export const getProducts = async () => {
  const response = await api.get("/products?limit=100");
  // El backend devuelve { data: [...], total, page } por la paginación
  return response.data.data ?? response.data;
};

export const getProduct = async (id: number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};