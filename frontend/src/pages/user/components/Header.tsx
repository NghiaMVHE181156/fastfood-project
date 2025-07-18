import { authApi } from "@/api/auth";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/types/auth";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  cart?: boolean;
  totalItems?: number;
  totalPrice?: number;
  formatPrice?: (price: number) => string;
}

export function Header({
  cart,
  totalItems,
  totalPrice,
  formatPrice,
}: HeaderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authApi.isAuthenticated()) {
      const userData = authApi.getUser();
      if (userData && userData.role === "user") {
        // Nếu là user, có thể gọi API để lấy thông tin mới nhất
        authApi
          .getProfile()
          .then((res) => {
            if (res.data.success && res.data.data) {
              setUser(res.data.data);
            } else {
              setUser(userData);
            }
            setLoading(false);
          })
          .catch(() => {
            setUser(userData);
            setLoading(false);
          });
      } else {
        // Nếu là admin/shipper, chỉ lấy từ localStorage
        setUser(userData);
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    navigate("/");
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleSignUp = () => {
    window.location.href = "/register";
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <h1 className="text-2xl font-bold text-orange-600">
              Menu Thức Ăn Nhanh
            </h1>
            <p className="text-sm text-gray-600">Thực đơn hôm nay</p>
          </div>
          <div className="flex items-center gap-4">
            {user &&
              authApi.isAuthenticated() &&
              user.role === "user" &&
              cart &&
              typeof totalItems === "number" &&
              typeof totalPrice === "number" &&
              formatPrice && (
                <div className="relative">
                  <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-orange-600">
                      {totalItems} món - {formatPrice(totalPrice)}
                    </span>
                  </div>
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500">
                      {totalItems}
                    </Badge>
                  )}
                </div>
              )}
            {!loading &&
              (user ? (
                <div className="flex items-center gap-2">
                  {user.avatar_url && (
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  )}
                  <span
                    className="font-medium text-gray-700 cursor-pointer hover:underline"
                    onClick={() =>
                      user.role === "user" && navigate("/user/profile")
                    }
                    title="Xem hồ sơ"
                  >
                    {user.full_name}
                  </span>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                    onClick={handleLogin}
                  >
                    Đăng nhập
                  </button>
                  <button
                    className="px-3 py-1 bg-white text-orange-600 border border-orange-600 rounded hover:bg-orange-50 text-sm"
                    onClick={handleSignUp}
                  >
                    Đăng ký
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}
