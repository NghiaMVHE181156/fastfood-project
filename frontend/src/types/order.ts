export interface OrderItem {
  order_item_id: number;
  dish_id: number;
  quantity: number;
  unit_price: number;
  dish_name: string;
  dish_description: string;
  dish_image: string | null;
}

export interface DeliveryLog {
  log_id: number;
  status: OrderStatusType;
  timestamp: string;
  note: string;
}

import type { OrderStatusType } from "./order-status";

export interface Order {
  order_id: number;
  status: OrderStatusType;
  total_amount: number;
  payment_method: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  delivery_logs: DeliveryLog[];
  address?: string;
  user_name?: string;
}
