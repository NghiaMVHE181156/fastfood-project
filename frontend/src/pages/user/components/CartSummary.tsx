import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Dish } from "@/types/index";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

interface CartItem {
  dish: Dish | undefined;
  quantity: number;
}

interface CartSummaryProps {
  cartItems: CartItem[];
  formatPrice: (price: number) => string;
  getTotalPrice: () => number;
  onViewDetail: (dishId: number) => void;
  onUpdateQuantity: (dishId: number, quantity: number) => void;
  onRemoveItem: (dishId: number) => void;
  onOrder: () => void;
}

export function CartSummary({
  cartItems,
  formatPrice,
  getTotalPrice,
  onViewDetail,
  onUpdateQuantity,
  onRemoveItem,
  onOrder,
}: CartSummaryProps) {
  const validItems = cartItems.filter((item) => item.dish);
  if (validItems.length === 0) return null;
  // CSS helper cho multi-line ellipsis
  const nameClass =
    "font-bold text-base cursor-pointer hover:underline text-orange-700 text-center leading-tight line-clamp-2 max-w-full";
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[95vw] w-[370px] sm:w-[400px]">
      <Card className="rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <CardHeader className="pb-2 pt-4 px-6">
          <CardTitle className="text-xl font-extrabold text-orange-700 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" /> Giỏ hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-6 pb-6 pt-2">
          <div
            className={
              validItems.length > 2
                ? "max-h-[220px] overflow-y-auto pr-1 space-y-3"
                : "space-y-3"
            }
          >
            {validItems.map((item) => (
              <div
                key={item.dish!.dish_id}
                className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-white/80 rounded-xl p-3 shadow-sm hover:shadow-md transition group"
              >
                <div className="flex flex-col items-center w-full sm:w-auto">
                  <img
                    src={item.dish!.image_url || ""}
                    alt={item.dish!.name}
                    className="w-14 h-14 object-cover rounded-lg border mb-1"
                    onClick={() => onViewDetail(item.dish!.dish_id)}
                    style={{ cursor: "pointer" }}
                  />
                  <div
                    className={nameClass}
                    onClick={() => onViewDetail(item.dish!.dish_id)}
                    title={item.dish!.name}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.5em",
                      maxWidth: 120,
                    }}
                  >
                    {item.dish!.name}
                  </div>
                  <div className="text-xs text-gray-400 text-center">
                    {formatPrice(item.dish!.price)} / món
                  </div>
                </div>
                <div className="flex flex-1 flex-row items-center justify-center gap-2 mt-2 sm:mt-0">
                  <button
                    className="p-1 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-200"
                    onClick={() =>
                      onUpdateQuantity(
                        item.dish!.dish_id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value));
                      onUpdateQuantity(item.dish!.dish_id, val);
                    }}
                    className="w-12 text-center mx-1 rounded-lg border border-orange-200"
                    style={{ padding: 0 }}
                  />
                  <button
                    className="p-1 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-200"
                    onClick={() =>
                      onUpdateQuantity(item.dish!.dish_id, item.quantity + 1)
                    }
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-orange-700 w-20 text-right inline-block">
                    {formatPrice(item.dish!.price * item.quantity)}
                  </span>
                  <button
                    className="ml-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full p-1 transition border border-red-200"
                    onClick={() => onRemoveItem(item.dish!.dish_id)}
                    title="Xóa khỏi giỏ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Tổng cộng:</span>
              <span className="text-orange-600 text-2xl drop-shadow">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <div className="text-xs text-gray-400 text-right mt-1">
              (Đã bao gồm VAT, chưa gồm phí ship)
            </div>
          </div>
          <button
            className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg transition-all duration-150"
            onClick={onOrder}
          >
            <ShoppingCart className="w-5 h-5" /> Đặt hàng ngay
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
