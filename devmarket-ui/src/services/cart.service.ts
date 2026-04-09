import { api } from "./api";
 
export const getCart = async () => {
  const response = await api.get("/cart/me");
  return response.data;
};
 
export const addToCart = async (productId: number, quantity: number = 1) => {
  const response = await api.post("/cart/add", { productId, quantity });
  return response.data;
};
 
export const removeFromCart = async (productId: number) => {
  const response = await api.delete(`/cart/remove/${productId}`);
  return response.data;
};
 
export const checkout = async () => {
  const response = await api.post("/cart/checkout");
  return response.data;
};
 