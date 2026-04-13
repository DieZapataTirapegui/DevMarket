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

export interface CreateProductData {
  externalId: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}
 
export const createProduct = async (data: CreateProductData) => {
  const response = await api.post("/products", data);
  return response.data;
};
 
export const updateProduct = async (id: number, data: Partial<CreateProductData>) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};
 
export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
 