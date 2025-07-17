import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Dish } from "@/types/index";
import { useEffect, useState } from "react";

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: Dish, quantity?: number) => void;
}

export function DishDetailModal({
  dish,
  isOpen,
  onClose,
  onAddToCart,
}: DishDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    setQuantity(1);
  }, [dish]);
  if (!dish) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton
        className="max-w-lg w-full p-0 overflow-hidden rounded-3xl shadow-2xl border-0"
      >
        <div className="bg-gradient-to-br from-orange-50 via-white to-blue-50 px-8 py-8 flex flex-col items-center">
          <DialogHeader className="w-full">
            <DialogTitle className="text-3xl font-extrabold text-orange-700 mb-2 text-center drop-shadow">
              {dish.name}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mb-5 text-center">
                <span className="block text-gray-700 font-semibold mb-1 text-lg">
                  Mô tả:
                </span>
                <p className="text-gray-600 whitespace-pre-line text-base min-h-[2.5em]">
                  {dish.description || "Không có mô tả."}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mb-6 w-full">
            <img
              src={dish.image_url || ""}
              alt={dish.name || ""}
              className="w-72 h-56 object-cover rounded-2xl shadow-lg border-2 border-orange-100 bg-white mx-auto"
              style={{ maxHeight: 260 }}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 w-full gap-4">
            <span className="text-orange-600 font-extrabold text-2xl drop-shadow text-center">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(dish.price)}
            </span>
            <div className="flex flex-row items-center justify-center bg-orange-50 rounded-full shadow-inner min-w-[140px] h-14">
              <button
                className="w-12 h-12 flex items-center justify-center bg-white border border-orange-200 rounded-full text-2xl font-bold text-orange-600 hover:bg-orange-100 transition focus:outline-none"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Giảm số lượng"
                type="button"
                tabIndex={0}
              >
                -
              </button>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-14 h-12 text-center border-0 bg-transparent text-lg font-bold focus:ring-0 mx-2 p-0 flex items-center justify-center"
                style={{ boxShadow: "none" }}
              />
              <button
                className="w-12 h-12 flex items-center justify-center bg-white border border-orange-200 rounded-full text-2xl font-bold text-orange-600 hover:bg-orange-100 transition focus:outline-none"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Tăng số lượng"
                type="button"
                tabIndex={0}
              >
                +
              </button>
            </div>
          </div>
          <button
            className="w-full px-4 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-extrabold text-xl shadow-lg hover:from-orange-600 hover:to-orange-700 transition mb-1 mt-2 tracking-wide"
            onClick={() => onAddToCart(dish, quantity)}
            type="button"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
