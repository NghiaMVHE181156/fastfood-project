import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { OrderItemsList } from "../../user/components/OrderItemsList";
import { OrderTimeline } from "../../user/components/OrderTimeline";
import type { Order } from "@/types/order";

interface ShipperOrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  loading: boolean;
}

export function ShipperOrderDetailModal({
  open,
  onOpenChange,
  order,
}: ShipperOrderDetailModalProps) {
  if (!order) return null;
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng #{order.order_id}</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[70vh] pr-2">
          <div className="flex flex-col gap-2 mb-2">
            <div>
              <span className="font-semibold">Khách hàng:</span>{" "}
              {order.user_name || "-"}
            </div>
            <div>
              <span className="font-semibold">Địa chỉ:</span>{" "}
              {order.address || "-"}
            </div>
            <div>
              <span className="font-semibold">Tổng tiền:</span>{" "}
              {formatPrice(order.total_amount)}
            </div>
            <div>
              <span className="font-semibold">Phương thức thanh toán:</span>{" "}
              {order.payment_method}
            </div>
            <div>
              <span className="font-semibold">Trạng thái:</span>{" "}
              <Badge>{order.status}</Badge>
            </div>
          </div>
          <div className="mb-4">
            <OrderItemsList items={order.items} />
          </div>
          <div>
            <OrderTimeline deliveryLogs={order.delivery_logs} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
