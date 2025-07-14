import type { Category, Dish } from "@/types/index";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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
      <h2 className="text-xl font-semibold text-orange-700 mb-4">
        {category.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredDishes.map((dish) => (
          <Card key={dish.dish_id} className="flex flex-col pt-0">
            <CardContent className="p-0">
              <img
                src={dish.image_url || ""}
                alt={dish.name || ""}
                className="w-full h-40 object-cover rounded-t mb-2"
              />
            </CardContent>
            <CardHeader className="pb-2">
              <CardTitle className="font-bold text-lg mb-1">
                {dish.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 mb-2">
                {dish.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto flex items-center justify-between gap-2">
              <span className="text-orange-600 font-semibold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(dish.price)}
              </span>
              <div className="flex gap-2">
                <button
                  className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                  onClick={() => onViewDetail(dish.dish_id)}
                >
                  View details
                </button>
                <button
                  className="text-xs px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                  onClick={() => onAddToCart(dish)}
                >
                  Add to cart
                </button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
