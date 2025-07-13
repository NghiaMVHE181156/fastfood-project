import { api } from "./client";
import type { AxiosResponse } from "axios";
import type {
  RegisterData,
  LoginData,
  LoginResponse,
  UserProfile,
  ApiResponse,
} from "@/types/auth";

// Auth API functions
export const authApi = {
  /**
   * Register a new user
   * @param data - User registration data
   * @returns Promise with registration response
   */
  register: async (
    data: RegisterData
  ): Promise<AxiosResponse<ApiResponse<UserProfile>>> => {
    return api.post<ApiResponse<UserProfile>>("/auth/register", data);
  },

  /**
   * Login user
   * @param data - Login credentials
   * @returns Promise with login response containing token and user info
   */
  login: async (
    data: LoginData
  ): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => {
    return api.post<ApiResponse<LoginResponse>>("/auth/login", data);
  },

  /**
   * Get user profile (for regular users)
   * @returns Promise with user profile data
   */
  getProfile: async (): Promise<AxiosResponse<ApiResponse<UserProfile>>> => {
    return api.get<ApiResponse<UserProfile>>("/auth/profile");
  },

  /**
   * Get admin profile (admin role required)
   * @returns Promise with admin profile data
   */
  getAdminProfile: async (): Promise<
    AxiosResponse<ApiResponse<UserProfile>>
  > => {
    return api.get<ApiResponse<UserProfile>>("/auth/admin/profile");
  },

  /**
   * Get shipper profile (shipper role required)
   * @returns Promise with shipper profile data
   */
  getShipperProfile: async (): Promise<
    AxiosResponse<ApiResponse<UserProfile>>
  > => {
    return api.get<ApiResponse<UserProfile>>("/auth/shipper/profile");
  },

  /**
   * Get profile based on user role
   * @param role - User role ('user', 'admin', 'shipper')
   * @returns Promise with profile data
   */
  getProfileByRole: async (
    role: string
  ): Promise<AxiosResponse<ApiResponse<UserProfile>>> => {
    switch (role) {
      case "admin":
        return authApi.getAdminProfile();
      case "shipper":
        return authApi.getShipperProfile();
      default:
        return authApi.getProfile();
    }
  },

  /**
   * Store authentication token in localStorage
   * @param token - JWT token
   */
  setToken: (token: string): void => {
    localStorage.setItem("token", token);
  },

  /**
   * Get authentication token from localStorage
   * @returns Token string or null
   */
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  /**
   * Remove authentication token from localStorage
   */
  removeToken: (): void => {
    localStorage.removeItem("token");
  },

  /**
   * Check if user is authenticated
   * @returns Boolean indicating if user has a valid token
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("token");
    return token !== null && token !== "";
  },

  /**
   * Logout user (remove token only, let components handle redirect)
   */
  logout: (): void => {
    localStorage.removeItem("token");
  },
};

export default authApi;
