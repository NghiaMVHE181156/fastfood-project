import { useEffect, useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { shipperApi } from "@/api/shipperApi";
import { authApi } from "@/api/auth";
import type { AvailableOrder } from "@/api/shipperApi";
import type { UserProfile } from "@/types/auth";
import { ShipperSidebar } from "./components/ShipperSidebar";
import { AvailableOrders } from "./components/AvailableOrders";
import { ShipperOrderDetailModal } from "./components/ShipperOrderDetailModal";
import type { Order } from "@/types/order";
import { AssignedOrders } from "./components/AssignedOrders";
import type { AssignedOrder } from "@/api/shipperApi";

function toAssignedOrder(o: unknown): AssignedOrder {
  const obj = o as Record<string, unknown>;
  return {
    order_id: obj.order_id as number,
    status: obj.status as string,
    total_amount: obj.total_amount as number,
    payment_method: obj.payment_method as string,
    created_at: obj.created_at as string,
    updated_at: obj.updated_at as string,
    item_count: obj.item_count as number,
  };
}

export default function ShipperDashboardPage() {
  const [activeTab, setActiveTab] = useState("available-orders");
  const [orders, setOrders] = useState<AvailableOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [shipper, setShipper] = useState<UserProfile | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [assignedOrders, setAssignedOrders] = useState<AssignedOrder[]>([]);
  const [loadingAssigned, setLoadingAssigned] = useState(false);

  useEffect(() => {
    const fetchShipperProfile = async () => {
      try {
        if (!authApi.isAuthenticated()) {
          window.location.href = "/login";
          return;
        }
        const response = await authApi.getShipperProfile();
        if (response.data.success && response.data.data) {
          setShipper(response.data.data);
        }
      } catch {
        authApi.logout();
        window.location.href = "/login";
      }
    };
    fetchShipperProfile();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await shipperApi.getAvailableOrders();
      if (res.data.success) {
        setOrders(res.data.data);
      } else {
        toast.error(res.data.message || "Lỗi khi tải đơn hàng");
      }
    } catch {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedOrders = async () => {
    setLoadingAssigned(true);
    try {
      const res = await shipperApi.getAssignedOrders();
      if (
        res.data.success &&
        res.data.data &&
        Array.isArray(res.data.data.orders)
      ) {
        setAssignedOrders(res.data.data.orders);
      } else {
        setAssignedOrders([]);
      }
    } catch {
      toast.error("Không thể tải danh sách đơn đang giao");
      setAssignedOrders([]);
    } finally {
      setLoadingAssigned(false);
    }
  };

  useEffect(() => {
    if (activeTab === "available-orders") fetchOrders();
    if (activeTab === "assigned-orders") fetchAssignedOrders();
  }, [activeTab]);

  const handleAssign = async (orderId: number) => {
    try {
      const res = await shipperApi.assignOrder(orderId);
      if (res.data.success) {
        toast.success("Nhận đơn thành công!");
        fetchOrders();
      } else {
        toast.error(res.data.message || "Không thể nhận đơn");
      }
    } catch {
      toast.error("Không thể nhận đơn hàng");
    }
  };

  const handleViewDetail = async (orderId: number) => {
    setLoadingDetail(true);
    setDetailModalOpen(true);
    try {
      const res = await shipperApi.getOrderDetail(orderId);
      if (res.data.success && res.data.data) {
        setSelectedOrder(res.data.data);
      } else {
        setSelectedOrder(null);
      }
    } catch {
      setSelectedOrder(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOnWay = async (orderId: number) => {
    try {
      await shipperApi.onWayOrder(orderId);
      toast.success("Đã chuyển sang trạng thái đi giao!");
      fetchAssignedOrders();
    } catch {
      toast.error("Không thể chuyển sang trạng thái đi giao");
    }
  };

  const handleDelivered = async (orderId: number) => {
    try {
      await shipperApi.deliveredOrder(orderId);
      toast.success("Đã xác nhận giao thành công!");
      fetchAssignedOrders();
    } catch {
      toast.error("Không thể xác nhận giao thành công");
    }
  };

  const handleFailed1 = async (orderId: number) => {
    try {
      await shipperApi.failed1Order(orderId);
      toast.success("Đã xác nhận giao thất bại lần 1!");
      fetchAssignedOrders();
    } catch {
      toast.error("Không thể xác nhận giao thất bại lần 1");
    }
  };

  const handleRedelivery = async (orderId: number) => {
    try {
      await shipperApi.redeliveryOrder(orderId);
      toast.success("Đã chuyển sang trạng thái giao lại!");
      fetchAssignedOrders();
    } catch {
      toast.error("Không thể chuyển sang trạng thái giao lại");
    }
  };

  const handleRedelivered = async (orderId: number) => {
    try {
      await shipperApi.redeliveredOrder(orderId);
      toast.success("Đã xác nhận giao lại thành công!");
      fetchAssignedOrders();
    } catch {
      toast.error("Không thể xác nhận giao lại thành công");
    }
  };

  const handleFailed2 = async (orderId: number) => {
    try {
      await shipperApi.failed2Order(orderId);
      toast.success("Đã xác nhận giao thất bại lần 2!");
      fetchAssignedOrders();
    } catch {
      toast.error("Không thể xác nhận giao thất bại lần 2");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "available-orders":
        return (
          <AvailableOrders
            orders={orders}
            loading={loading}
            onAssign={handleAssign}
            onViewDetail={handleViewDetail}
          />
        );
      case "assigned-orders":
        return (
          <AssignedOrders
            orders={
              Array.isArray(assignedOrders)
                ? assignedOrders.map(toAssignedOrder)
                : []
            }
            loading={loadingAssigned}
            onViewDetail={handleViewDetail}
            onOnWay={handleOnWay}
            onDelivered={handleDelivered}
            onFailed1={handleFailed1}
            onRedelivery={handleRedelivery}
            onRedelivered={handleRedelivered}
            onFailed2={handleFailed2}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <ShipperSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold capitalize">
              {activeTab === "available-orders" ? "Đơn hàng chờ nhận" : ""}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {shipper && (
              <span className="font-medium text-base">
                {shipper.full_name || shipper.user_name}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
        <ShipperOrderDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          order={selectedOrder}
          loading={loadingDetail}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
