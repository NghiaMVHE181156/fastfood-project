"use client";

import { useEffect, useState } from "react";
import { userApi } from "@/api/userApi";
import { CategorySection } from "./components/CategorySection";
import { DishDetailModal } from "./components/DishDetailModal";
import type { Category, Dish } from "@/types/index";
import { Header } from "./components/Header";
import { CartSummary } from "./components/CartSummary";
import { authApi } from "@/api/auth";
import type { UserProfile } from "@/types/auth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function UserMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [dishDetail, setDishDetail] = useState<Dish | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // Change cartItems type to store only dish_id and quantity
  const [cartItems, setCartItems] = useState<
    Array<{ dish_id: number; quantity: number }>
  >(() => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderAddress, setOrderAddress] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  // Set user from localStorage on mount
  useEffect(() => {
    setUser(authApi.getUser());
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await userApi.getCategories();
        if (res.data.success && res.data.data) {
          setCategories(res.data.data);
        }
      } catch {
        setError("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const res = await userApi.getDishes();
        if (res.data.success && res.data.data) {
          setDishes(res.data.data);
        }
      } catch {
        setError("Không thể tải món ăn");
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  const handleViewDetail = async (dishId: number) => {
    setLoading(true);
    try {
      const res = await userApi.getDishDetail(dishId);
      if (res.data.success && res.data.data) {
        setDishDetail(res.data.data);
        setIsDetailModalOpen(true);
      }
    } catch {
      setError("Không thể tải chi tiết món ăn");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (dish: Dish, quantity = 1) => {
    if (!user) {
      toast.error("Please login to continue.", { position: "top-center" });
      return;
    }
    if (user.role !== "user") {
      toast.error("Only users can add to cart.", { position: "top-center" });
      return;
    }
    const exists = cartItems.find((item) => item.dish_id === dish.dish_id);
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.dish_id === dish.dish_id);
      if (existingItem) {
        return prev.map((item) =>
          item.dish_id === dish.dish_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { dish_id: dish.dish_id, quantity }];
    });
    if (exists) {
      toast.success("Added more to cart!", { position: "top-center" });
    } else {
      toast.success("Added to cart!", { position: "top-center" });
    }
  };

  const handleOrder = () => setIsOrderModalOpen(true);
  const handleOrderSubmit = async () => {
    if (orderAddress.trim().length < 10) {
      toast.error("Địa chỉ phải từ 10 ký tự trở lên");
      return;
    }
    setOrderLoading(true);
    try {
      const res = await userApi.createOrder({
        items: cartItems,
        address: orderAddress,
        payment_method: "COD",
      });
      if (res.data.success) {
        toast.success("Đặt hàng thành công!");
        setCartItems([]);
        setIsOrderModalOpen(false);
        setOrderAddress("");
      } else {
        toast.error(res.data.message || "Đặt hàng thất bại");
      }
    } catch {
      toast.error("Đặt hàng thất bại");
    } finally {
      setOrderLoading(false);
    }
  };

  // Helper to get dish by id
  const getDishById = (id: number) => dishes.find((d) => d.dish_id === id);

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () =>
    cartItems.reduce((total, item) => {
      const dish = getDishById(item.dish_id);
      return dish ? total + dish.price * item.quantity : total;
    }, 0);
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        cart
        totalItems={getTotalItems()}
        totalPrice={getTotalPrice()}
        formatPrice={formatPrice}
      />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <CategorySection
                key={category.category_id}
                category={category}
                dishes={dishes}
                onViewDetail={handleViewDetail}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
        {/* Cart Summary */}
        <CartSummary
          cartItems={cartItems
            .map((item) => ({
              dish: getDishById(item.dish_id),
              quantity: item.quantity,
            }))
            .filter((item) => item.dish)}
          formatPrice={formatPrice}
          getTotalPrice={getTotalPrice}
          onViewDetail={handleViewDetail}
          onUpdateQuantity={(dishId, quantity) => {
            if (quantity < 1) return;
            setCartItems((prev) =>
              prev.map((item) =>
                item.dish_id === dishId ? { ...item, quantity } : item
              )
            );
          }}
          onRemoveItem={(dishId) => {
            setCartItems((prev) =>
              prev.filter((item) => item.dish_id !== dishId)
            );
          }}
          onOrder={handleOrder}
        />
      </main>
      {/* Dish Detail Modal */}
      <DishDetailModal
        dish={dishDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
      {/* Order Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {cartItems.map((item) => {
              const dish = getDishById(item.dish_id);
              if (!dish) return null;
              return (
                <div
                  key={dish.dish_id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {dish.name} x{item.quantity}
                  </span>
                  <span>{formatPrice(dish.price * item.quantity)}</span>
                </div>
              );
            })}
            <div className="font-bold flex justify-between border-t pt-2 mt-2">
              <span>Tổng cộng:</span>
              <span className="text-orange-600">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <div>
              <label className="block font-medium mb-1">
                Địa chỉ giao hàng
              </label>
              <Input
                value={orderAddress}
                onChange={(e) => setOrderAddress(e.target.value)}
                placeholder="Nhập địa chỉ giao hàng"
                minLength={10}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Phương thức thanh toán
              </label>
              <span className="inline-block px-2 py-1 bg-gray-100 rounded">
                COD
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 font-semibold"
                onClick={handleOrderSubmit}
                disabled={orderLoading}
              >
                {orderLoading ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
              </button>
              <button
                className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setIsOrderModalOpen(false)}
                disabled={orderLoading}
              >
                Hủy
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
