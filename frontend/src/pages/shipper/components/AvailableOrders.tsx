import type { AvailableOrder } from "@/api/shipperApi";
import { Button } from "@/components/ui/button";

interface AvailableOrdersProps {
  orders: AvailableOrder[];
  loading: boolean;
  onAssign: (orderId: number) => void;
}

export function AvailableOrders({
  orders,
  loading,
  onAssign,
}: AvailableOrdersProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Đơn hàng chờ nhận</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : orders.length === 0 ? (
        <div>Không có đơn hàng nào chờ nhận.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded shadow p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">
                  #{order.order_id} - {order.user_name}
                </div>
                <div>Địa chỉ: {order.address}</div>
                <div>Tổng tiền: {order.total_amount.toLocaleString()}đ</div>
                <div>Cập nhật: {order.updated_at}</div>
              </div>
              <Button
                onClick={() => onAssign(order.order_id)}
                variant="default"
              >
                Nhận đơn
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
