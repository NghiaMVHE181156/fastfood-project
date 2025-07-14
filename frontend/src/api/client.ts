import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// API Response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// API Error interface
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  error?: {
    code: string;
    details: unknown;
  };
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token only, let components handle redirect
          localStorage.removeItem("token");
          console.error("Unauthorized access - token cleared");
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
        default:
          console.error(`HTTP Error: ${status}`);
      }

      return Promise.reject({
        message: data?.message || "An error occurred",
        status,
        code: data?.error?.code || data?.code,
      });
    } else if (error.request) {
      // Network error
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: 0,
      });
    } else {
      // Other error
      return Promise.reject({
        message: error.message || "An unexpected error occurred",
        status: 0,
      });
    }
  }
);

// API methods
export const api = {
  // GET request
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  // POST request
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  // PUT request
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },

  // Upload file
  upload: <T = unknown>(
    url: string,
    file: File,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
  },
};

// Export the axios instance for advanced usage
export default apiClient;

// Export types
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError };
