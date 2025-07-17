import { api } from "./client";
import type { AxiosResponse } from "axios";
import type { ApiResponse, OrderSummary } from "@/types/index";
import type { Dish, Category } from "@/types/index";
import type { UserProfile } from "@/types/auth";
import type { Order } from "@/types/order";

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
  }): Promise<
    AxiosResponse<
      ApiResponse<{
        order_id: number;
        total_amount: number;
        items: Array<{
          dish_id: number;
          quantity: number;
          unit_price: number;
          name: string;
        }>;
      }>
    >
  > => api.post("/orders", payload),
  updateProfile: (
    data: Partial<UserProfile>
  ): Promise<AxiosResponse<ApiResponse<UserProfile>>> =>
    api.put("/user/profile", data),
  getOrderHistory: (
    page = 1,
    limit = 10
  ): Promise<
    AxiosResponse<
      ApiResponse<{
        orders: OrderSummary[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>
    >
  > => api.get(`/orders/history?page=${page}&limit=${limit}`),
  getOrderDetail: (
    orderId: number
  ): Promise<AxiosResponse<ApiResponse<Order>>> =>
    api.get(`/orders/${orderId}`),
};
