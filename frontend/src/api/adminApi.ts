import apiClient from "@/lib/api-client";
import type {
  Category,
  Dish,
  Shipper,
  ApiResponse,
} from "@/types/admin-management";
import type { AxiosResponse } from "axios";

export const adminApi = {
  // Categories
  getAllCategories: async (): Promise<
    AxiosResponse<ApiResponse<Category[]>>
  > => {
    return apiClient.get<ApiResponse<Category[]>>("/admin/categories");
  },
  createCategory: async (
    data: Omit<Category, "category_id">
  ): Promise<AxiosResponse<ApiResponse<Category>>> => {
    return apiClient.post<ApiResponse<Category>>("/admin/categories", data);
  },
  updateCategory: async (
    id: number,
    data: Partial<Omit<Category, "category_id">>
  ): Promise<AxiosResponse<ApiResponse<Category>>> => {
    return apiClient.put<ApiResponse<Category>>(
      `/admin/categories/${id}`,
      data
    );
  },
  deleteCategory: async (
    id: number
  ): Promise<AxiosResponse<ApiResponse<null>>> => {
    return apiClient.delete<ApiResponse<null>>(`/admin/categories/${id}`);
  },

  // Dishes
  getAllDishes: async (): Promise<AxiosResponse<ApiResponse<Dish[]>>> => {
    return apiClient.get<ApiResponse<Dish[]>>("/admin/dishes");
  },
  createDish: async (
    data: Omit<Dish, "dish_id" | "image_url"> & { image_url?: string | null }
  ): Promise<AxiosResponse<ApiResponse<Dish>>> => {
    return apiClient.post<ApiResponse<Dish>>("/admin/dishes", data);
  },
  updateDish: async (
    id: number,
    data: Partial<Omit<Dish, "dish_id">>
  ): Promise<AxiosResponse<ApiResponse<Dish>>> => {
    return apiClient.put<ApiResponse<Dish>>(`/admin/dishes/${id}`, data);
  },
  deleteDish: async (id: number): Promise<AxiosResponse<ApiResponse<null>>> => {
    return apiClient.delete<ApiResponse<null>>(`/admin/dishes/${id}`);
  },

  // Shippers
  getAllShippers: async (): Promise<AxiosResponse<ApiResponse<Shipper[]>>> => {
    return apiClient.get<ApiResponse<Shipper[]>>("/admin/shippers");
  },
  createShipper: async (
    data: Omit<Shipper, "shipper_id" | "created_at"> & { password: string }
  ): Promise<AxiosResponse<ApiResponse<Shipper>>> => {
    return apiClient.post<ApiResponse<Shipper>>("/admin/shippers", data);
  },
  updateShipper: async (
    id: number,
    data: Partial<Omit<Shipper, "shipper_id" | "created_at">>
  ): Promise<AxiosResponse<ApiResponse<Shipper>>> => {
    return apiClient.put<ApiResponse<Shipper>>(`/admin/shippers/${id}`, data);
  },
  deleteShipper: async (
    id: number
  ): Promise<AxiosResponse<ApiResponse<null>>> => {
    return apiClient.delete<ApiResponse<null>>(`/admin/shippers/${id}`);
  },
};
