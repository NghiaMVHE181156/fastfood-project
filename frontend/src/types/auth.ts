// Auth-related TypeScript interfaces and types

export interface RegisterData {
  user_name: string;
  email: string;
  full_name: string;
  phone: string;
  password: string;
}

export interface LoginData {
  user_name: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  id: number;
}

export interface UserProfile {
  // For all roles
  user_name: string;
  email: string;
  // For user
  user_id?: number;
  // For admin
  admin_id?: number;
  // For shipper
  shipper_id?: number;
  // For all roles (optional, for backward compatibility)
  id?: number;
  full_name?: string;
  phone?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  // User-specific fields
  address?: string;
  avatar_url?: string;
  gender?: string;
  birthdate?: string;
  status?: string;
  is_flagged?: boolean;
  boom_count?: number;
  note?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: unknown;
  };
}

// User roles
export const UserRole = {
  USER: "user",
  ADMIN: "admin",
  SHIPPER: "shipper",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// Auth state interface for context/store
export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth context interface
export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
