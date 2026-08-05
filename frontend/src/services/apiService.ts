import axios from "axios";
import { InventoryItem, InventoryItemCreateDTO } from "../models/InventoryItem";
import { QueryParams } from "../models/QueryParams";
import { PagedResponse } from "../models/PagedResponse";
import { AuthResponse } from "../models/Auth";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "token";

const filterEmptyQueryParams = (params: QueryParams) => {
  const filteredParams: Record<string, string | number | boolean> = {};
  Object.keys(params).forEach((key) => {
    const value = params[key as keyof QueryParams];
    if (value !== null && value !== undefined && value !== "") {
      filteredParams[key] = value;
    }
  });
  return filteredParams;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT to every outgoing request, if one is stored.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// When the backend rejects a request with 401 (missing/expired token),
// clear the stored credentials and notify the app so it can show the login.
// A failed login attempt also returns 401, so the auth endpoints are exempt.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/")) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("username");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export const register = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", { username, password });
  return response.data;
};

export const fetchInventoryItems = async (
  query: QueryParams
): Promise<PagedResponse> => {
  const filteredParams = filterEmptyQueryParams(query);
  const response = await api.get("/inventory", {
    params: filteredParams,
  });
  return response.data;
};

export const addInventoryItem = async (
  item: InventoryItemCreateDTO
): Promise<InventoryItem> => {
  const response = await api.post("/inventory", item);
  return response.data;
};

export const updateInventoryItem = async (
  id: number,
  item: InventoryItemCreateDTO
): Promise<InventoryItem> => {
  const response = await api.put(`/inventory/${id}`, item);
  return response.data;
};

export const deleteInventoryItem = async (
  id: number
): Promise<InventoryItem> => {
  const response = await api.delete(`/inventory/${id}`);
  return response.data;
};
