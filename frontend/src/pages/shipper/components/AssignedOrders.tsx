import { useState } from "react";
import type { AssignedOrder } from "@/api/shipperApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssignedOrdersProps {
  orders: AssignedOrder[];
  loading: boolean;
  onViewDetail: (orderId: number) => void;
  onOnWay: (orderId: number) => void;
  onDelivered: (orderId: number) => void;
  onFailed1: (orderId: number) => void;
  onRedelivery: (orderId: number) => void;
  onRedelivered: (orderId: number) => void;
  onFailed2: (orderId: number) => void;
}

export function AssignedOrders({
  orders,
  loading,
  onViewDetail,
  onOnWay,
  onDelivered,
  onFailed1,
  onRedelivery,
  onRedelivered,
  onFailed2,
}: AssignedOrdersProps) {
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
      <h1 className="text-2xl font-bold mb-4">Đơn đang giao</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : orders.length === 0 ? (
        <div>Không có đơn hàng nào đang giao.</div>
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
                          <span>{formatDateTime(order.created_at)}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatPrice(order.total_amount)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <CreditCard className="h-4 w-4" />
                        <span>{order.payment_method}</span>
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
                          Số món: {order.item_count}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Updated: {formatDateTime(order.updated_at)}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setExpandedId(isExpanded ? null : order.order_id);
                          if (!isExpanded) onViewDetail(order.order_id);
                        }}
                        variant="outline"
                      >
                        Xem chi tiết
                      </Button>
                      {(order.status === "pending" ||
                        order.status === "assigned") && (
                        <Button
                          onClick={() => onOnWay(order.order_id)}
                          variant="default"
                        >
                          Đi giao
                        </Button>
                      )}
                      {order.status === "on_way" && (
                        <>
                          <Button
                            onClick={() => onDelivered(order.order_id)}
                            variant="default"
                          >
                            Đã giao
                          </Button>
                          <Button
                            onClick={() => onFailed1(order.order_id)}
                            variant="destructive"
                          >
                            Giao thất bại lần 1
                          </Button>
                        </>
                      )}
                      {order.status === "failed" && (
                        <Button
                          onClick={() => onRedelivery(order.order_id)}
                          variant="default"
                        >
                          Giao lại
                        </Button>
                      )}
                      {order.status === "returned" && (
                        <>
                          <Button
                            onClick={() => onRedelivered(order.order_id)}
                            variant="default"
                          >
                            Đã giao lại
                          </Button>
                          <Button
                            onClick={() => onFailed2(order.order_id)}
                            variant="destructive"
                          >
                            Giao thất bại lần 2
                          </Button>
                        </>
                      )}
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
