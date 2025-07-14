import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Dish } from "@/types/index";

interface CartItem {
  dish: Dish;
  quantity: number;
}

interface CartSummaryProps {
  cartItems: CartItem[];
  formatPrice: (price: number) => string;
  getTotalPrice: () => number;
}

export function CartSummary({
  cartItems,
  formatPrice,
  getTotalPrice,
}: CartSummaryProps) {
  if (cartItems.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Giỏ hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {cartItems.map((item) => (
            <div
              key={item.dish.dish_id}
              className="flex justify-between items-center text-sm"
            >
              <span className="flex-1">{item.dish.name}</span>
              <span className="text-gray-600">x{item.quantity}</span>
              <span className="font-semibold ml-2">
                {formatPrice(item.dish.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center font-bold">
              <span>Tổng cộng:</span>
              <span className="text-orange-600">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
