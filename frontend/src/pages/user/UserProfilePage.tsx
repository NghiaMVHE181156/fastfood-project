import { useEffect, useState } from "react";
import { authApi } from "@/api/auth";
import type { UserProfile } from "@/types/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userApi } from "@/api/userApi";
import { toast } from "sonner";
import type { OrderSummary } from "@/types/index";
import type { Order } from "@/types/order";
import { Header } from "./components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, History } from "lucide-react";
import { OrderCard } from "./components/OrderCard";
import { StatusFilter } from "./components/StatusFilter";

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    avatar_url: "",
    gender: "",
    birthdate: "",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailedOrders, setDetailedOrders] = useState<Map<number, Order>>(
    new Map()
  );
  const [loadingDetails, setLoadingDetails] = useState<Set<number>>(new Set());

  useEffect(() => {
    const u = authApi.getUser();
    setUser(u);
    if (u)
      setForm({
        full_name: u.full_name || "",
        email: u.email || "",
        phone: u.phone || "",
        address: u.address || "",
        avatar_url: u.avatar_url || "",
        gender: u.gender || "",
        birthdate: u.birthdate || "",
      });

    // Lấy lịch sử đơn hàng
    setLoadingOrders(true);
    userApi
      .getOrderHistory()
      .then((res) => {
        if (res.data.success && res.data.data?.orders) {
          // Transform OrderSummary to Order format
          const transformedOrders: Order[] = res.data.data.orders.map(
            (orderSummary: OrderSummary) => ({
              order_id: orderSummary.order_id,
              status: orderSummary.status,
              total_amount: orderSummary.total_amount || 0,
              payment_method: orderSummary.payment_method || "COD",
              created_at: orderSummary.created_at,
              updated_at: orderSummary.updated_at || orderSummary.created_at,
              items: [], // Will be populated when order details are fetched
              delivery_logs: [], // Will be populated when order details are fetched
            })
          );
          setOrders(transformedOrders);
        }
      })
      .finally(() => setLoadingOrders(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await userApi.updateProfile(form);
      if (res.data.success && res.data.data) {
        setUser(res.data.data);
        authApi.setUser(res.data.data);
        toast.success("Profile updated successfully!");
        setEdit(false);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const handleCancel = () => {
    // Restore original user data to form
    if (user) {
      setForm({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar_url: user.avatar_url || "",
        gender: user.gender || "",
        birthdate: user.birthdate || "",
      });
    }
    setEdit(false);
  };

  const loadOrderDetails = async (orderId: number) => {
    // Check if we already have the details
    if (detailedOrders.has(orderId)) {
      return;
    }

    // Check if we're already loading this order
    if (loadingDetails.has(orderId)) {
      return;
    }

    setLoadingDetails((prev) => new Set(prev).add(orderId));

    try {
      const res = await userApi.getOrderDetail(orderId);
      if (res.data.success && res.data.data) {
        setDetailedOrders((prev) => new Map(prev).set(orderId, res.data.data));
      } else {
        toast.error("Failed to load order details");
      }
    } catch {
      toast.error("Failed to load order details");
    } finally {
      setLoadingDetails((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getOrderWithDetails = (order: Order): Order => {
    const detailedOrder = detailedOrders.get(order.order_id);
    if (detailedOrder) {
      return detailedOrder;
    }
    return order;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_id.toString().includes(searchTerm) ||
      order.items.some((item) =>
        item.dish_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTotalSpent = () => {
    return orders.reduce((total, order) => total + order.total_amount, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!user) return <div className="p-8">User information not found.</div>;

  return (
    <div>
      {/* Header */}
      <Header />
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <Input
                name="full_name"
                value={form.full_name}
                onChange={handleInputChange}
                disabled={!edit}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <Input
                name="email"
                value={form.email}
                onChange={handleInputChange}
                disabled={!edit}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                disabled={!edit}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Address</label>
              <Input
                name="address"
                value={form.address}
                onChange={handleInputChange}
                disabled={!edit}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Avatar URL</label>
              <Input
                name="avatar_url"
                value={form.avatar_url}
                onChange={handleInputChange}
                disabled={!edit}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-sm">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleSelectChange}
                  disabled={!edit}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm">
                  Birthdate
                </label>
                <Input
                  name="birthdate"
                  type="date"
                  value={form.birthdate}
                  onChange={handleInputChange}
                  disabled={!edit}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {edit ? (
              <>
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEdit(true)}>Edit</Button>
            )}
          </div>
        </div>
        {/* Order History Header */}
        <div className="bg-white shadow-sm border-b mb-6 px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <History className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Order History
                </h3>
                <p className="text-sm text-gray-600">Track your orders</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Spent</div>
              <div className="text-xl font-bold text-orange-600">
                {formatPrice(getTotalSpent())}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by order ID or dish name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <StatusFilter
                value={statusFilter}
                onValueChange={setStatusFilter}
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {loadingOrders ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-lg">Loading...</div>
              </CardContent>
            </Card>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={getOrderWithDetails(order)}
                onExpand={() => loadOrderDetails(order.order_id)}
                isLoadingDetails={loadingDetails.has(order.order_id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all"
                    ? "Try changing filters or search terms"
                    : "You don't have any orders yet"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
