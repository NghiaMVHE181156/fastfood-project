import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Dish } from "@/types/index";
import { Input } from "@/components/ui/input";

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
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-100 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Cart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {validItems.map((item) => (
            <div
              key={item.dish!.dish_id}
              className="flex items-center text-sm gap-2"
            >
              <span
                className="flex-1 cursor-pointer hover:underline"
                onClick={() => onViewDetail(item.dish!.dish_id)}
              >
                {item.dish!.name}
              </span>

              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  const val = Math.max(1, Number(e.target.value));
                  onUpdateQuantity(item.dish!.dish_id, val);
                }}
                className="w-16 text-center mx-1"
              />

              <span className="font-semibold ml-2 w-20 text-right inline-block">
                {formatPrice(item.dish!.price * item.quantity)}
              </span>
              <button
                className="ml-2 text-red-500 hover:text-red-700 text-xs"
                onClick={() => onRemoveItem(item.dish!.dish_id)}
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center font-bold">
              <span>Total:</span>
              <span className="text-orange-600">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
          </div>
          <button
            className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 font-semibold"
            onClick={onOrder}
          >
            Order
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
