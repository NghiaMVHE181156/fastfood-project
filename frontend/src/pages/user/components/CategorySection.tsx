import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category, Dish } from "@/types/index";

interface CategorySectionProps {
  category: Category;
  dishes: Dish[];
  onViewDetail: (dishId: number) => void;
  onAddToCart: (dish: Dish, quantity?: number) => void;
}

export function CategorySection({
  category,
  dishes,
  onViewDetail,
  onAddToCart,
}: CategorySectionProps) {
  const filteredDishes = dishes.filter(
    (dish) => dish.category_id === category.category_id
  );
  if (filteredDishes.length === 0) return null;
  return (
    <section>
      <h2 className="text-3xl font-extrabold text-orange-700 mb-8 tracking-tight drop-shadow select-none">
        {category.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-50">
        {filteredDishes.map((dish) => (
          <Card
            key={dish.dish_id}
            className="flex flex-col pt-0 bg-gradient-to-br from-orange-50 via-white to-blue-50 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-200 border-0 overflow-hidden group scale-100 hover:scale-[1.03] cursor-pointer min-h-[480px] h-full"
            style={{ minWidth: 320, maxWidth: 420 }}
          >
            <CardContent className="p-0 flex justify-center">
              <img
                src={dish.image_url || ""}
                alt={dish.name || ""}
                className="w-full h-60 object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-300 shadow-md"
                style={{ maxHeight: 240 }}
              />
            </CardContent>
            <CardHeader className="pb-2 pt-6 px-8 flex-1 flex flex-col justify-center items-center">
              <CardTitle
                className="font-extrabold text-xl mb-4 text-gray-900 text-center break-words line-clamp-3"
                style={{ minHeight: "3.6em" }}
              >
                {dish.name}
              </CardTitle>
            </CardHeader>
            <CardFooter className="mt-auto flex flex-col gap-4 px-8 pb-8">
              <span className="text-orange-600 font-extrabold text-2xl drop-shadow text-center">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(dish.price)}
              </span>
              <div className="flex gap-4 justify-center">
                <button
                  className="text-base px-5 py-2 bg-orange-100 text-orange-700 rounded-full font-bold shadow-sm hover:bg-orange-200 transition-all duration-150 border border-orange-200"
                  onClick={() => onViewDetail(dish.dish_id)}
                >
                  Xem chi tiết
                </button>
                <button
                  className="text-base px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold shadow hover:from-orange-600 hover:to-orange-700 transition-all duration-150 border-0"
                  onClick={() => onAddToCart(dish)}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
