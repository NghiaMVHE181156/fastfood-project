"use client";

import { Badge } from "@/components/ui/badge";
import { getStatusConfig } from "@/types/order-status";

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.color}>
      {config.icon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
}
