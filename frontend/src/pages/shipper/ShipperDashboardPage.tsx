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
import type { AvailableOrder } from "@/api/shipperApi";
import { ShipperSidebar } from "./components/ShipperSidebar";
import { AvailableOrders } from "./components/AvailableOrders";

export default function ShipperDashboardPage() {
  const [activeTab, setActiveTab] = useState("available-orders");
  const [orders, setOrders] = useState<AvailableOrder[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (activeTab === "available-orders") fetchOrders();
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

  const renderContent = () => {
    switch (activeTab) {
      case "available-orders":
      default:
        return (
          <AvailableOrders
            orders={orders}
            loading={loading}
            onAssign={handleAssign}
          />
        );
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
            {/* Có thể thêm thông tin shipper ở đây nếu muốn */}
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
      </SidebarInset>
    </SidebarProvider>
  );
}
