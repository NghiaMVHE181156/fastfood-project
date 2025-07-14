import { api } from "./client";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/index";
import type { Dish, Category } from "@/types/index";
import type { UserProfile } from "@/types/user";

export const userApi = {
  getCategories: (): Promise<AxiosResponse<ApiResponse<Category[]>>> =>
    api.get("/menu/categories"),
  getDishes: (): Promise<AxiosResponse<ApiResponse<Dish[]>>> =>
    api.get("/menu/dishes"),
  getDishDetail: (id: number): Promise<AxiosResponse<ApiResponse<Dish>>> =>
    api.get(`/menu/dishes/${id}`),
  createOrder: (payload: {
    items: Array<{ dish_id: number; quantity: number }>;
    address: string;
    payment_method: string;
  }): Promise<AxiosResponse<ApiResponse<any>>> => api.post("/orders", payload),
  updateProfile: (
    data: Partial<UserProfile>
  ): Promise<AxiosResponse<ApiResponse<UserProfile>>> =>
    api.put("/user/profile", data),
  getOrderHistory: (
    page = 1,
    limit = 10
  ): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get(`/orders/history?page=${page}&limit=${limit}`),
};
