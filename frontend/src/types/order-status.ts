// Order Status Constants
export const OrderStatus = {
  // Order table statuses
  PREPARING: "preparing",
  ASSIGNED: "assigned",
  DELIVERING: "delivering",
  SUCCESS: "success",
  FAILED_1: "failed_1",
  FAILED_2: "failed_2",
  REDELIVERY: "redelivery",
  BOMB: "bomb",

  // Shipping table statuses
  PENDING: "pending",
  PICKED_UP: "picked_up",
  ON_WAY: "on_way",
  DELIVERED: "delivered",
  FAILED: "failed",
  RETURNED: "returned",

  // Payment table statuses
  PAYMENT_PENDING: "payment_pending",
  PAYMENT_COMPLETED: "payment_completed",
  PAYMENT_FAILED: "payment_failed",
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

// Status configuration for UI display
export interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
  icon?: string;
}

// Status configurations for different status types
export const ORDER_STATUS_CONFIG: Record<OrderStatusType, StatusConfig> = {
  // Order statuses
  [OrderStatus.PREPARING]: {
    label: "Preparing",
    variant: "default",
    color: "bg-orange-100 text-orange-800",
    icon: "🍳",
  },
  [OrderStatus.ASSIGNED]: {
    label: "Assigned to Shipper",
    variant: "default",
    color: "bg-blue-100 text-blue-800",
    icon: "🚚",
  },
  [OrderStatus.DELIVERING]: {
    label: "Delivering",
    variant: "default",
    color: "bg-indigo-100 text-indigo-800",
    icon: "🛵",
  },
  [OrderStatus.SUCCESS]: {
    label: "Delivery Successful",
    variant: "default",
    color: "bg-green-100 text-green-800",
    icon: "✅",
  },
  [OrderStatus.FAILED_1]: {
    label: "Delivery Failed (1st attempt)",
    variant: "destructive",
    color: "bg-red-100 text-red-800",
    icon: "❌",
  },
  [OrderStatus.FAILED_2]: {
    label: "Delivery Failed (2nd attempt)",
    variant: "destructive",
    color: "bg-red-100 text-red-800",
    icon: "❌",
  },
  [OrderStatus.REDELIVERY]: {
    label: "Redelivery",
    variant: "secondary",
    color: "bg-purple-100 text-purple-800",
    icon: "🔄",
  },
  [OrderStatus.BOMB]: {
    label: "Customer No-show",
    variant: "destructive",
    color: "bg-red-100 text-red-800",
    icon: "💣",
  },

  // Shipping statuses
  [OrderStatus.PENDING]: {
    label: "Waiting for Shipper",
    variant: "secondary",
    color: "bg-yellow-100 text-yellow-800",
    icon: "⏳",
  },
  [OrderStatus.PICKED_UP]: {
    label: "Shipper Picked Up",
    variant: "default",
    color: "bg-blue-100 text-blue-800",
    icon: "📦",
  },
  [OrderStatus.ON_WAY]: {
    label: "Shipper on the Way",
    variant: "default",
    color: "bg-indigo-100 text-indigo-800",
    icon: "🛵",
  },
  [OrderStatus.DELIVERED]: {
    label: "Delivered Successfully",
    variant: "default",
    color: "bg-green-100 text-green-800",
    icon: "✅",
  },
  [OrderStatus.FAILED]: {
    label: "Delivery Failed",
    variant: "destructive",
    color: "bg-red-100 text-red-800",
    icon: "❌",
  },
  [OrderStatus.RETURNED]: {
    label: "Returned",
    variant: "secondary",
    color: "bg-purple-100 text-purple-800",
    icon: "🔄",
  },

  // Payment statuses
  [OrderStatus.PAYMENT_PENDING]: {
    label: "Payment Pending",
    variant: "secondary",
    color: "bg-yellow-100 text-yellow-800",
    icon: "💰",
  },
  [OrderStatus.PAYMENT_COMPLETED]: {
    label: "Payment Completed",
    variant: "default",
    color: "bg-green-100 text-green-800",
    icon: "✅",
  },
  [OrderStatus.PAYMENT_FAILED]: {
    label: "Payment Failed",
    variant: "destructive",
    color: "bg-red-100 text-red-800",
    icon: "❌",
  },
};

// Helper function to get status config
export const getStatusConfig = (status: string): StatusConfig => {
  const normalizedStatus = status.toLowerCase();
  return (
    ORDER_STATUS_CONFIG[normalizedStatus as OrderStatusType] || {
      label: status,
      variant: "secondary",
      color: "bg-gray-100 text-gray-800",
      icon: "❓",
    }
  );
};

// Helper function to get status label
export const getStatusLabel = (status: string): string => {
  return getStatusConfig(status).label;
};

// Helper function to get status color
export const getStatusColor = (status: string): string => {
  return getStatusConfig(status).color;
};

// Helper function to get status icon
export const getStatusIcon = (status: string): string => {
  return getStatusConfig(status).icon || "❓";
};

// Status groups for filtering
export const STATUS_GROUPS = {
  ACTIVE: [
    OrderStatus.PREPARING,
    OrderStatus.ASSIGNED,
    OrderStatus.DELIVERING,
    OrderStatus.PENDING,
    OrderStatus.PICKED_UP,
    OrderStatus.ON_WAY,
  ],
  COMPLETED: [
    OrderStatus.SUCCESS,
    OrderStatus.DELIVERED,
    OrderStatus.PAYMENT_COMPLETED,
  ],
  FAILED: [
    OrderStatus.FAILED_1,
    OrderStatus.FAILED_2,
    OrderStatus.FAILED,
    OrderStatus.BOMB,
    OrderStatus.PAYMENT_FAILED,
  ],
  PENDING: [OrderStatus.PENDING, OrderStatus.PAYMENT_PENDING],
};
