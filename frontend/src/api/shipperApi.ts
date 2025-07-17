import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import type { AxiosResponse } from "axios";

export interface AvailableOrder {
  order_id: number;
  user_name: string;
  address: string;
  total_amount: number;
  updated_at: string;
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
};
