"use client";

import { authApi } from "@/api/auth";
import { userApi } from "@/api/userApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { Slider } from "@/components/ui/slider";
import type { UserProfile } from "@/types/auth";
import type { Category, Dish } from "@/types/index";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CartSummary } from "./components/CartSummary";
import { CategorySection } from "./components/CategorySection";
import { DishDetailModal } from "./components/DishDetailModal";
import { Header } from "./components/Header";

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // State cho search/filter/sort
  const [searchTerm, setSearchTerm] = useState("");
  // Tìm min/max giá từ dishes
  const minPrice = dishes.length ? Math.min(...dishes.map((d) => d.price)) : 0;
  const maxPrice = dishes.length
    ? Math.max(...dishes.map((d) => d.price))
    : 1000000;
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [sortDesc, setSortDesc] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">("COD");

  // Set user from localStorage on mount and sync with logout
  useEffect(() => {
    const interval = setInterval(() => {
      const currentUser = authApi.getUser();
      setUser(currentUser);
      if (!currentUser || !authApi.isAuthenticated()) {
        setCartItems([]);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && authApi.isAuthenticated()) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

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

  // Khi dishes thay đổi, cập nhật lại priceRange nếu cần
  useEffect(() => {
    if (dishes.length) {
      const min = Math.min(...dishes.map((d) => d.price));
      const max = Math.max(...dishes.map((d) => d.price));
      setPriceRange([min, max]);
    }
  }, [dishes]);

  // Khi fetch xong categories, mặc định chọn category đầu tiên
  useEffect(() => {
    if (categories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(categories[0].category_id);
    }
  }, [categories]);

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
    if (paymentMethod !== "COD") {
      toast.warning(
        "Chức năng thanh toán này đang được phát triển, vui lòng chọn phương án khác!"
      );
      return;
    }
    setOrderLoading(true);
    try {
      const res = await userApi.createOrder({
        items: cartItems,
        address: orderAddress,
        payment_method: paymentMethod,
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

  // Lọc và sắp xếp dishes theo search/filter/sort
  const filteredDishes = dishes
    .filter(
      (dish) =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        dish.price >= priceRange[0] &&
        dish.price <= priceRange[1]
    )
    .sort((a, b) => (sortDesc ? b.price - a.price : a.price - b.price));

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
          <div className="py-12 flex justify-center">
            <Loading text="Đang tải dữ liệu thực đơn..." />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <>
            {/* Bộ lọc search, filter, sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
              <div className="flex-1 w-full md:w-1/3">
                <Input
                  placeholder="Tìm kiếm món ăn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="flex flex-col items-center md:flex-row gap-2 w-full md:w-1/3">
                <span className="text-sm text-gray-500">Giá từ</span>
                <span className="font-semibold text-orange-600 min-w-[70px]">
                  {formatPrice(priceRange[0])}
                </span>
                <div className="w-40 md:w-56 px-2">
                  <Slider
                    min={minPrice}
                    max={maxPrice}
                    step={1000}
                    value={priceRange}
                    onValueChange={(val) =>
                      setPriceRange(val as [number, number])
                    }
                    defaultValue={[minPrice, maxPrice]}
                  />
                </div>
                <span className="text-sm text-gray-500">đến</span>
                <span className="font-semibold text-orange-600 min-w-[70px]">
                  {formatPrice(priceRange[1])}
                </span>
              </div>
              <button
                className={clsx(
                  "px-4 py-2 rounded border text-sm font-medium transition flex items-center gap-1",
                  sortDesc
                    ? "bg-orange-600 text-white border-orange-600 shadow"
                    : "bg-white text-orange-600 border-orange-200 hover:bg-orange-50"
                )}
                onClick={() => setSortDesc((prev) => !prev)}
              >
                Sắp xếp giá {sortDesc ? "↓" : "↑"}
              </button>
            </div>
            {/* Category tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.category_id}
                  className={clsx(
                    "px-4 py-2 rounded-full border text-sm font-medium transition",
                    selectedCategoryId === category.category_id
                      ? "bg-orange-600 text-white border-orange-600 shadow"
                      : "bg-white text-orange-600 border-orange-200 hover:bg-orange-50"
                  )}
                  onClick={() => setSelectedCategoryId(category.category_id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            {/* Dishes of selected category */}
            {selectedCategoryId &&
              (filteredDishes.some(
                (dish) => dish.category_id === selectedCategoryId
              ) ? (
                <CategorySection
                  category={
                    categories.find(
                      (c) => c.category_id === selectedCategoryId
                    )!
                  }
                  dishes={filteredDishes}
                  onViewDetail={handleViewDetail}
                  onAddToCart={handleAddToCart}
                />
              ) : (
                <div className="w-full py-24 flex flex-col items-center justify-center text-gray-400 text-lg font-semibold">
                  Hiện tại chưa có món ăn nào trong danh mục này.
                </div>
              ))}
          </>
        )}
        {/* Cart Summary */}
        {user && authApi.isAuthenticated() && user.role === "user" && (
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
        )}
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
        <DialogContent className="rounded-2xl p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-extrabold text-orange-700">
              Xác nhận đơn hàng
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-4">
            <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 bg-orange-50/40 rounded-xl p-2">
              {cartItems.map((item) => {
                const dish = getDishById(item.dish_id);
                if (!dish) return null;
                return (
                  <div
                    key={dish.dish_id}
                    className="flex items-center justify-between py-2 gap-2"
                  >
                    <span
                      className="truncate font-medium text-gray-800 max-w-[220px]"
                      title={dish.name}
                    >
                      {dish.name}{" "}
                      <span className="text-xs text-gray-400">
                        x{item.quantity}
                      </span>
                    </span>
                    <span className="font-semibold text-orange-700 min-w-[80px] text-right">
                      {formatPrice(dish.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="font-bold flex justify-between border-t pt-3 mt-2 text-lg">
              <span>Tổng cộng:</span>
              <span className="text-orange-600 text-2xl drop-shadow">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <div className="text-xs text-gray-400 text-right -mt-2 mb-2">
              (Đã bao gồm VAT, chưa gồm phí ship)
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="order-address">
                Địa chỉ giao hàng
              </label>
              <Input
                id="order-address"
                value={orderAddress}
                onChange={(e) => setOrderAddress(e.target.value)}
                placeholder="Nhập địa chỉ giao hàng"
                minLength={10}
                required
                className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Phương thức thanh toán
              </label>
              <div className="flex gap-3 mt-1">
                {/* COD */}
                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold transition-all duration-150 ${
                    paymentMethod === "COD"
                      ? "bg-orange-100 border-orange-500 text-orange-700 ring-2 ring-orange-200"
                      : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-orange-50"
                  }`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-5 h-5 text-orange-500"
                  >
                    <rect
                      x="2"
                      y="6"
                      width="20"
                      height="12"
                      rx="2"
                      fill="currentColor"
                    />
                    <rect
                      x="6"
                      y="10"
                      width="4"
                      height="2"
                      rx="1"
                      fill="#fff"
                    />
                  </svg>
                  COD
                </button>
                {/* VNPay */}
                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold transition-all duration-150 ${
                    paymentMethod === "VNPAY"
                      ? "bg-blue-100 border-blue-500 text-blue-700 ring-2 ring-blue-200"
                      : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-blue-50"
                  }`}
                  onClick={() => {
                    // Hiện toast/cảnh báo, không cho chọn
                    toast.warning(
                      "Chức năng đang được phát triển, vui lòng sử dụng phương án thanh toán khác!",
                      { position: "top-center" }
                    );
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    fill="none"
                    className="w-5 h-5"
                  >
                    <rect width="48" height="48" rx="12" fill="#0A68FE" />
                    <text
                      x="24"
                      y="30"
                      text-anchor="middle"
                      fill="white"
                      font-size="16"
                      font-family="Arial, Helvetica, sans-serif"
                    >
                      VN
                    </text>
                  </svg>
                  VNPay
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg transition-all duration-150"
                onClick={handleOrderSubmit}
                disabled={orderLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 17.25V6.75z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 9.75h.008v.008H6.75V9.75zm0 3h.008v.008H6.75v-.008zm0 3h.008v.008H6.75v-.008z"
                  />
                </svg>
                {orderLoading ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
              </button>
              <button
                className="flex-1 px-4 py-3 bg-gray-200 rounded-2xl hover:bg-gray-300 font-semibold text-gray-700"
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
