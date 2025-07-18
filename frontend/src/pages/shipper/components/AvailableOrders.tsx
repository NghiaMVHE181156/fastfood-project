import { useState } from "react";
import type { AvailableOrder } from "@/api/shipperApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, Package } from "lucide-react";

interface AvailableOrdersProps {
  orders: AvailableOrder[];
  loading: boolean;
  onAssign: (orderId: number) => void;
  onViewDetail: (orderId: number) => void;
}

export function AvailableOrders({
  orders,
  loading,
  onAssign,
  onViewDetail,
}: AvailableOrdersProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Đơn hàng chờ nhận</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : orders.length === 0 ? (
        <div>Không có đơn hàng nào chờ nhận.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order.order_id;
            return (
              <Card key={order.order_id} className="mb-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Order #{order.order_id}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(order.updated_at)}</span>
                        </div>
                      </div>
                      <Badge variant="outline">Chờ nhận</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatPrice(order.total_amount)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <CreditCard className="h-4 w-4" />
                        <span>COD</span>
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
                          Địa chỉ: {order.address}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Updated: {formatDateTime(order.updated_at)}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setExpandedId(isExpanded ? null : order.order_id);
                          if (!isExpanded) onViewDetail(order.order_id);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        onClick={() => onAssign(order.order_id)}
                        variant="default"
                      >
                        Nhận đơn
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
