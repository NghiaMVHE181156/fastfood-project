import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import type { AxiosResponse } from "axios";
import type { Order } from "@/types/order";

export interface AvailableOrder {
  order_id: number;
  user_name: string;
  address: string;
  total_amount: number;
  updated_at: string;
}

export interface AssignedOrder {
  order_id: number;
  status: string;
  total_amount: number;
  payment_method: string;
  created_at: string;
  updated_at: string;
  item_count: number;
  address?: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const shipperApi = {
  getAvailableOrders: async (): Promise<
    AxiosResponse<ApiResponse<AvailableOrder[]>>
  > => {
    return apiClient.get<ApiResponse<AvailableOrder[]>>(
      "/shipper/orders/available"
    );
  },
  assignOrder: async (
    orderId: number
  ): Promise<AxiosResponse<ApiResponse<null>>> => {
    return apiClient.post<ApiResponse<null>>(
      `/shipper/orders/${orderId}/assign`
    );
  },
  getOrderDetail: async (
    orderId: number
  ): Promise<AxiosResponse<ApiResponse<Order>>> => {
    return apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
  },
  getAssignedOrders: async (): Promise<
    AxiosResponse<
      ApiResponse<{ orders: AssignedOrder[]; pagination: Pagination }>
    >
  > => {
    return apiClient.get<
      ApiResponse<{ orders: AssignedOrder[]; pagination: Pagination }>
    >("/orders/shipper");
  },
  onWayOrder: async (orderId: number) => {
    return apiClient.patch(`/shipper/orders/${orderId}/onway`);
  },
  deliveredOrder: async (orderId: number) => {
    return apiClient.patch(`/shipper/orders/${orderId}/delivered`);
  },
  failed1Order: async (orderId: number, note?: string) => {
    return apiClient.patch(`/shipper/orders/${orderId}/failed1`, { note });
  },
  redeliveryOrder: async (orderId: number, note?: string) => {
    return apiClient.patch(`/shipper/orders/${orderId}/redelivery`, { note });
  },
  redeliveredOrder: async (orderId: number) => {
    return apiClient.patch(`/shipper/orders/${orderId}/redelivered`);
  },
  failed2Order: async (orderId: number, note?: string) => {
    return apiClient.patch(`/shipper/orders/${orderId}/failed2`, { note });
  },
};
