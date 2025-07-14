import type { Dish } from "@/types/index";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>{dish.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="mb-2">
              <span className="block text-gray-700 font-semibold mb-1">
                Description:
              </span>
              <p className="text-gray-700 whitespace-pre-line">
                {dish.description}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <img
          src={dish.image_url || ""}
          alt={dish.name || ""}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <div className="flex items-center justify-between mb-4">
          <span className="text-orange-600 font-semibold text-lg">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "VND",
            }).format(dish.price)}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 bg-gray-200 rounded text-lg"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-16 text-center mx-1"
            />
            <button
              className="px-2 py-1 bg-gray-200 rounded text-lg"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        <button
          className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          onClick={() => onAddToCart(dish, quantity)}
        >
          Add to cart
        </button>
      </DialogContent>
    </Dialog>
  );
}
