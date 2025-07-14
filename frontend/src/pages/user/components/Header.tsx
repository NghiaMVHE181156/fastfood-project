import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { authApi } from "@/api/auth";
import type { UserProfile } from "@/types/auth";

interface HeaderProps {
  totalItems: number;
  totalPrice: number;
  formatPrice: (price: number) => string;
}

export function Header({ totalItems, totalPrice, formatPrice }: HeaderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (authApi.isAuthenticated()) {
        try {
          const res = await authApi.getProfile();
          if (res.data.success && res.data.data) {
            setUser(res.data.data);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    window.location.reload();
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div>
            <h1 className="text-2xl font-bold text-orange-600">
              FastFood Menu
            </h1>
            <p className="text-sm text-gray-600">Today’s menu</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
                <span className="font-semibold text-orange-600">
                  {totalItems} items - {formatPrice(totalPrice)}
                </span>
              </div>
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500">
                  {totalItems}
                </Badge>
              )}
            </div>
            {!loading &&
              (user ? (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">
                    {user.full_name || user.user_name}
                  </span>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                  onClick={handleLogin}
                >
                  Login
                </button>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}
