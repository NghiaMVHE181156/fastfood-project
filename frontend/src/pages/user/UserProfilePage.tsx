import { useEffect, useState } from "react";
import { authApi } from "@/api/auth";
import type { UserProfile } from "@/types/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userApi } from "@/api/userApi";
import { toast } from "sonner";
import type { OrderSummary } from "@/types/index";
import { Header } from "./components/Header";

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
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

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
          setOrders(res.data.data.orders);
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
        toast.success("Cập nhật thành công!");
        setEdit(false);
      } else {
        toast.error(res.data.message || "Cập nhật thất bại");
      }
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  if (!user)
    return <div className="p-8">Không tìm thấy thông tin người dùng.</div>;

  return (
    <div>
      {/* Header */}
      <Header />
      <div className="max-w-xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
        <div className="space-y-4 mb-8">
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
          <div>
            <label className="block font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleSelectChange}
              disabled={!edit}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Birthdate</label>
            <Input
              name="birthdate"
              type="date"
              value={form.birthdate}
              onChange={handleInputChange}
              disabled={!edit}
            />
          </div>
          <div className="flex gap-2 mt-2">
            {edit ? (
              <>
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setEdit(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEdit(true)}>Edit</Button>
            )}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Order History</h3>
        <div className="bg-white rounded shadow p-4">
          {loadingOrders ? (
            <div>Loading...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-500 italic">No orders found.</div>
          ) : (
            <ul className="divide-y">
              {orders.map((order) => (
                <li
                  key={order.order_id}
                  className="py-2 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      Order ID: #{order.order_id}
                    </div>
                    <div className="text-sm text-gray-500">
                      Date: {new Date(order.created_at).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      Total:{" "}
                      <span className="text-orange-600 font-semibold">
                        {order.total_amount?.toLocaleString()}₫
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Status: {order.status}
                    </div>
                  </div>
                  <div className="text-xs text-right">
                    {order.payment_method}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
