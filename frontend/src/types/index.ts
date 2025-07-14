// Admin management types

export interface Category {
  category_id: number;
  name: string;
  description: string;
}

export interface Dish {
  dish_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: number;
  is_available: boolean;
}

export interface Shipper {
  shipper_id: number;
  user_name: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
