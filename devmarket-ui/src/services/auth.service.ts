import { api } from "./api";

interface RegisterData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);

  const { access_token } = response.data;

  if (access_token) {
    localStorage.setItem("token", access_token);
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};