"use client";

import { useEffect, useState } from "react";
import { publicMenuApi } from "@/api/client";
import { CategorySection } from "./components/CategorySection";
import { DishDetailModal } from "./components/DishDetailModal";
import type { Category, Dish } from "@/types/index";
import { Header } from "./components/Header";
import { CartSummary } from "./components/CartSummary";
import { authApi } from "@/api/auth";
import type { UserProfile } from "@/types/auth";
import { toast } from "sonner";

export default function UserMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [dishDetail, setDishDetail] = useState<Dish | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // Change cartItems type to store only dish_id and quantity
  const [cartItems, setCartItems] = useState<
    Array<{ dish_id: number; quantity: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Set user from localStorage on mount
  useEffect(() => {
    setUser(authApi.getUser());
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Clear cart on logout
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        setCartItems([]);
        localStorage.removeItem("cartItems");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await publicMenuApi.getCategories();
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
        const res = await publicMenuApi.getDishes();
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
      const res = await publicMenuApi.getDishDetail(dishId);
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
        />
      </main>
      {/* Dish Detail Modal */}
      <DishDetailModal
        dish={dishDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
