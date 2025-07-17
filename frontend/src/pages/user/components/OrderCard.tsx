"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  Package,
  Loader2,
} from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderItemsList } from "./OrderItemsList";
import { OrderTimeline } from "./OrderTimeline";
import type { Order } from "../../../types/order";

interface OrderCardProps {
  order: Order;
  onExpand?: () => void;
  isLoadingDetails?: boolean;
}

export function OrderCard({
  order,
  onExpand,
  isLoadingDetails = false,
}: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method.toUpperCase()) {
      case "COD":
        return "Cash on Delivery";
      case "CARD":
        return "Credit Card";
      case "BANK":
        return "Bank Transfer";
      default:
        return method;
    }
  };

  const handleExpand = () => {
    if (!isExpanded && onExpand) {
      onExpand();
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="font-semibold text-lg">Order #{order.order_id}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(order.created_at)}</span>
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              {formatPrice(order.total_amount)}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <CreditCard className="h-4 w-4" />
              <span>{getPaymentMethodLabel(order.payment_method)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {order.items.length} items
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              Updated: {formatDateTime(order.updated_at)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExpand}
            disabled={isLoadingDetails}
          >
            {isLoadingDetails ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : isExpanded ? (
              <>
                Collapse <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                View Details <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-6">
            {isLoadingDetails ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Loading order details...</p>
              </div>
            ) : (
              <>
                <OrderItemsList items={order.items} />
                <OrderTimeline deliveryLogs={order.delivery_logs} />
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
