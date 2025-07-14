import { useEffect, useState } from "react";
import { publicMenuApi } from "@/api/client";
import type { AxiosResponse } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Category {
  category_id: number;
  name: string;
  description: string;
}

interface Dish {
  dish_id: number;
  name: string;
  price: number;
  image_url: string | null;
  is_available: boolean;
  category_id: number;
}

export default function UserMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res: AxiosResponse<any> = await publicMenuApi.getCategories();
        if (res.data.success && res.data.data) {
          setCategories(res.data.data);
          setSelectedCategory(res.data.data[0]?.category_id || null);
        }
      } catch (err) {
        setError("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory == null) return;
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const res: AxiosResponse<any> = await publicMenuApi.getDishes(
          selectedCategory
        );
        if (res.data.success && res.data.data) {
          setDishes(res.data.data);
        }
      } catch (err) {
        setError("Không thể tải món ăn");
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, [selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6 text-center">Menu</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {categories.map((cat) => (
            <Button
              key={cat.category_id}
              variant={
                selectedCategory === cat.category_id ? "default" : "outline"
              }
              onClick={() => setSelectedCategory(cat.category_id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      )}
      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dishes.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              Không có món ăn nào
            </div>
          ) : (
            dishes.map((dish) => (
              <Card key={dish.dish_id} className="h-full flex flex-col">
                <CardHeader className="p-0">
                  {dish.image_url ? (
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      className="w-full h-40 object-cover rounded-t"
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-xs text-gray-400 rounded-t">
                      No Image
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between p-4">
                  <div>
                    <CardTitle className="text-lg mb-2">{dish.name}</CardTitle>
                    <div className="text-primary font-semibold mb-2">
                      {dish.price.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                  {!dish.is_available && (
                    <div className="text-xs text-red-500 mt-2">Tạm hết</div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
