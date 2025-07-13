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
  id: number;
  user_name: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
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
