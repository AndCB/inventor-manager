import axios from "axios";
import { InventoryItem, InventoryItemCreateDTO } from "../models/InventoryItem";
import { QueryParams } from "../models/QueryParams";
import { PagedResponse } from "../models/PagedResponse";

const API_URL = import.meta.env.VITE_API_URL;

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
