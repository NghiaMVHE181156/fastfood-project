import { authApi } from "@/api/auth";
import { userApi } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { UserProfile } from "@/types/auth";
import type { OrderSummary } from "@/types/index";
import type { Order } from "@/types/order";
import {
  Calendar,
  Camera,
  CreditCard,
  History,
  Package,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Header } from "./components/Header";
import { OrderItemsList } from "./components/OrderItemsList";
import { OrderStatusBadge } from "./components/OrderStatusBadge";
import { OrderTimeline } from "./components/OrderTimeline";
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
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 10;
  // Filter và phân trang chỉ khai báo 1 lần
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
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

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

  const handleToggleExpand = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
        loadOrderDetails(orderId);
      }
      return newSet;
    });
  };

  if (!user) return <div className="p-8">User information not found.</div>;

  return (
    <div>
      {/* Header */}
      <Header />
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Thông tin cá nhân
        </h2>
        {/* Avatar section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={
                form.avatar_url ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(form.full_name)
              }
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 shadow-lg"
            />
            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                <svg
                  className="animate-spin h-8 w-8 text-orange-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
          {edit && !avatarUploading && (
            <>
              <button
                type="button"
                className="mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 shadow"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-5 h-5" /> Đổi ảnh đại diện
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setAvatarUploading(true);
                  const formData = new FormData();
                  formData.append("image", file);
                  try {
                    const res = await fetch(
                      "http://localhost:8080/profile/upload-image",
                      {
                        method: "POST",
                        body: formData,
                      }
                    );
                    const data = await res.json();
                    if (data.success && data.url) {
                      setForm((prev) => ({ ...prev, avatar_url: data.url }));
                      toast.success("Tải ảnh đại diện thành công!");
                    } else {
                      toast.error(data.message || "Tải ảnh đại diện thất bại");
                    }
                  } catch {
                    toast.error("Tải ảnh đại diện thất bại");
                  } finally {
                    setAvatarUploading(false);
                  }
                }}
                className="hidden"
                title="Chọn ảnh đại diện"
                disabled={avatarUploading}
              />
            </>
          )}
        </div>
        {/* Form section */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Họ và tên</label>
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
              <label className="block font-medium mb-1">Số điện thoại</label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                disabled={!edit}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Địa chỉ</label>
              <Input
                name="address"
                value={form.address}
                onChange={handleInputChange}
                disabled={!edit}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 col-span-2">
              <div>
                <label
                  htmlFor="gender-select"
                  className="block font-medium mb-1 text-sm"
                >
                  Giới tính
                </label>
                <select
                  id="gender-select"
                  name="gender"
                  value={form.gender}
                  onChange={handleSelectChange}
                  disabled={!edit}
                  className="w-full border rounded px-2 py-1 text-sm"
                  title="Giới tính"
                  aria-label="Giới tính"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm">
                  Ngày sinh
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
          <div className="flex gap-2 mt-4 justify-center">
            {edit ? (
              <>
                <Button onClick={handleSave}>Lưu</Button>
                <Button variant="outline" onClick={handleCancel}>
                  Hủy
                </Button>
              </>
            ) : (
              <Button onClick={() => setEdit(true)}>Chỉnh sửa</Button>
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
                  Lịch sử đơn hàng
                </h3>
                <p className="text-sm text-gray-600">
                  Theo dõi các đơn hàng của bạn
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Tổng chi tiêu</div>
              <div className="text-xl font-bold text-orange-600">
                {filteredOrders
                  .reduce((total, order) => total + order.total_amount, 0)
                  .toLocaleString("vi-VN")}{" "}
                đ
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tìm kiếm & Lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm theo mã đơn hoặc tên món..."
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
        <div className="flex flex-col gap-6 w-full">
          {loadingOrders ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-lg">Đang tải...</div>
              </CardContent>
            </Card>
          ) : paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-xl shadow border flex flex-col md:flex-row items-stretch justify-between p-6 gap-4"
              >
                {/* Order info trái */}
                <div className="flex-1 flex flex-col gap-2 justify-between">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                    <h3 className="font-bold text-xl text-orange-700">
                      Đơn #{order.order_id}
                    </h3>
                    <span className="ml-0 md:ml-4 mt-2 md:mt-0">
                      <OrderStatusBadge status={order.status} />
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(order.created_at).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Package className="h-4 w-4" />
                    <span>{order.items.length} món</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <CreditCard className="h-4 w-4" />
                    <span>
                      {order.payment_method === "COD"
                        ? "Thanh toán khi nhận hàng"
                        : order.payment_method}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    <span>
                      Cập nhật:{" "}
                      {new Date(order.updated_at).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
                {/* Tổng tiền phải trả phải */}
                <div className="flex flex-col items-end justify-between min-w-[160px]">
                  <div className="text-2xl font-bold text-orange-600 whitespace-nowrap">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.total_amount)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4"
                    onClick={() => handleToggleExpand(order.order_id)}
                    disabled={loadingDetails.has(order.order_id)}
                  >
                    {expandedOrders.has(order.order_id)
                      ? "Ẩn chi tiết"
                      : "Xem chi tiết"}
                  </Button>
                </div>
                {/* Chi tiết đơn hàng */}
                {expandedOrders.has(order.order_id) && (
                  <div className="w-full mt-6 border-t pt-6">
                    {loadingDetails.has(order.order_id) ? (
                      <div className="text-center py-8">
                        <svg
                          className="animate-spin h-8 w-8 mx-auto mb-4 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        <p className="text-gray-600">
                          Đang tải chi tiết đơn hàng...
                        </p>
                      </div>
                    ) : (
                      <>
                        <OrderItemsList
                          items={
                            detailedOrders.get(order.order_id)?.items || []
                          }
                        />
                        <OrderTimeline
                          deliveryLogs={
                            detailedOrders.get(order.order_id)?.delivery_logs ||
                            []
                          }
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy đơn hàng
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all"
                    ? "Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                    : "Bạn chưa có đơn hàng nào"}
                </p>
              </CardContent>
            </Card>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <Button
                  key={idx}
                  variant={currentPage === idx + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
