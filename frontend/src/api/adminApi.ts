import apiClient from "@/lib/api-client";
import type { Category, Dish, Shipper, ApiResponse } from "@/types";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";

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
    try {
      const res = await apiClient.post<ApiResponse<Category>>(
        "/admin/categories",
        data
      );
      if (res.data.success) {
        toast.success(res.data.message || "Thêm danh mục thành công", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message || "Thêm danh mục thất bại", {
          position: "top-center",
        });
      }
      return res;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(errorMsg, { position: "top-center" });
      throw err;
    }
  },
  updateCategory: async (
    id: number,
    data: Partial<Omit<Category, "category_id">>
  ): Promise<AxiosResponse<ApiResponse<Category>>> => {
    try {
      const res = await apiClient.put<ApiResponse<Category>>(
        `/admin/categories/${id}`,
        data
      );
      if (res.data.success) {
        toast.success(res.data.message || "Cập nhật danh mục thành công", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message || "Cập nhật danh mục thất bại", {
          position: "top-center",
        });
      }
      return res;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(errorMsg, { position: "top-center" });
      throw err;
    }
  },
  deleteCategory: async (
    id: number
  ): Promise<AxiosResponse<ApiResponse<null>>> => {
    try {
      const res = await apiClient.delete<ApiResponse<null>>(
        `/admin/categories/${id}`
      );
      if (res.data.success) {
        toast.success(res.data.message || "Xoá danh mục thành công", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message || "Xoá danh mục thất bại", {
          position: "top-center",
        });
      }
      return res;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(errorMsg, { position: "top-center" });
      throw err;
    }
  },

  // Dishes
  getAllDishes: async (): Promise<AxiosResponse<ApiResponse<Dish[]>>> => {
    return apiClient.get<ApiResponse<Dish[]>>("/admin/dishes");
  },
  createDish: async (
    data: Omit<Dish, "dish_id" | "image_url"> & { image_url?: string | null }
  ): Promise<AxiosResponse<ApiResponse<Dish>>> => {
    try {
      const res = await apiClient.post<ApiResponse<Dish>>(
        "/admin/dishes",
        data
      );
      if (res.data.success) {
        toast.success(res.data.message || "Thêm món ăn thành công", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message || "Thêm món ăn thất bại", {
          position: "top-center",
        });
      }
      return res;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(errorMsg, { position: "top-center" });
      throw err;
    }
  },
  updateDish: async (
    id: number,
    data: Partial<Omit<Dish, "dish_id">>
  ): Promise<AxiosResponse<ApiResponse<Dish>>> => {
    try {
      const res = await apiClient.put<ApiResponse<Dish>>(
        `/admin/dishes/${id}`,
        data
      );
      if (res.data.success) {
        toast.success(res.data.message || "Cập nhật món ăn thành công", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message || "Cập nhật món ăn thất bại", {
          position: "top-center",
        });
      }
      return res;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(errorMsg, { position: "top-center" });
      throw err;
    }
  },
  deleteDish: async (id: number): Promise<AxiosResponse<ApiResponse<null>>> => {
    try {
      const res = await apiClient.delete<ApiResponse<null>>(
        `/admin/dishes/${id}`
      );
      if (res.data.success) {
        toast.success(res.data.message || "Xoá món ăn thành công", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message || "Xoá món ăn thất bại", {
          position: "top-center",
        });
      }
      return res;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(errorMsg, { position: "top-center" });
      throw err;
    }
  },
  uploadDishImage: async (
    file: File
  ): Promise<
    AxiosResponse<{ success: boolean; message: string; data: { url: string } }>
  > => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiClient.post("/admin/dishes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success(res.data.message || "Upload ảnh thành công", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message || "Upload ảnh thất bại", {
          position: "top-center",
        });
      }
      return res;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(errorMsg, { position: "top-center" });
      throw err;
    }
  },

  // Shippers
  getAllShippers: async (): Promise<AxiosResponse<ApiResponse<Shipper[]>>> => {
    return apiClient.get<ApiResponse<Shipper[]>>("/admin/shippers");
  },
  createShipper: async (
    data: Omit<Shipper, "shipper_id" | "created_at"> & { password: string }
  ): Promise<AxiosResponse<ApiResponse<Shipper>>> => {
    try {
      const res = await apiClient.post<ApiResponse<Shipper>>(
        "/admin/shippers",
        data
      );
      if (res.data.success) {
        toast.success(res.data.message || "Thêm shipper thành công", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message || "Thêm shipper thất bại", {
          position: "top-center",
        });
      }
      return res;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(errorMsg, { position: "top-center" });
      throw err;
    }
  },
  updateShipper: async (
    id: number,
    data: Partial<Omit<Shipper, "shipper_id" | "created_at">>
  ): Promise<AxiosResponse<ApiResponse<Shipper>>> => {
    try {
      const res = await apiClient.put<ApiResponse<Shipper>>(
        `/admin/shippers/${id}`,
        data
      );
      if (res.data.success) {
        toast.success(res.data.message || "Cập nhật shipper thành công", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message || "Cập nhật shipper thất bại", {
          position: "top-center",
        });
      }
      return res;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(errorMsg, { position: "top-center" });
      throw err;
    }
  },
  deleteShipper: async (
    id: number
  ): Promise<AxiosResponse<ApiResponse<null>>> => {
    try {
      const res = await apiClient.delete<ApiResponse<null>>(
        `/admin/shippers/${id}`
      );
      if (res.data.success) {
        toast.success(res.data.message || "Xoá shipper thành công", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message || "Xoá shipper thất bại", {
          position: "top-center",
        });
      }
      return res;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(errorMsg, { position: "top-center" });
      throw err;
    }
  },
};
