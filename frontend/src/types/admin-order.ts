export interface AdminOrder {
  order_id: number;
  user_id: number;
  user_name: string;
  status: string;
  is_flagged: boolean;
  boom_count: number;
  created_at: string;
}

export interface AdminOrderResponse {
  success: boolean;
  data: AdminOrder[];
}

export interface ConfirmBombResponse {
  success: boolean;
  message: string;
}

export interface UnflagUserResponse {
  success: boolean;
  message: string;
}
