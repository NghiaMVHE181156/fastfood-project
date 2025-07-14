"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { Dish, Category } from "@/types";
import { adminApi } from "@/api/adminApi";

export function DishesManagement() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category_id: 0,
    is_available: true,
    image_url: undefined as string | null | undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch dishes and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dishRes, catRes] = await Promise.all([
          adminApi.getAllDishes(),
          adminApi.getAllCategories(),
        ]);
        if (dishRes.data.success && dishRes.data.data) {
          setDishes(dishRes.data.data);
        }
        if (catRes.data.success && catRes.data.data) {
          setCategories(catRes.data.data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.category_id === categoryId);
    return category?.name || "Unknown";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let image_url = formData.image_url || null;
    if (imageFile) {
      const uploadRes = await adminApi.uploadDishImage(imageFile);
      if (uploadRes.data.success) {
        image_url = uploadRes.data.data?.url || null;
      }
    }
    if (editingDish) {
      const res = await adminApi.updateDish(editingDish.dish_id, {
        ...formData,
        image_url,
      });
      if (res.data.success && res.data.data) {
        setDishes(
          dishes.map((dish) =>
            dish.dish_id === editingDish.dish_id ? res.data.data : dish
          )
        );
      }
    } else {
      const res = await adminApi.createDish({ ...formData, image_url });
      if (res.data.success && res.data.data) {
        setDishes([res.data.data, ...dishes]);
      }
    }
    setIsDialogOpen(false);
    setEditingDish(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      category_id: 0,
      is_available: true,
      image_url: undefined,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category_id: dish.category_id,
      is_available: dish.is_available,
      image_url: dish.image_url ?? undefined,
    });
    setImagePreview(dish.image_url || null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const toggleAvailability = async (dishId: number) => {
    const dish = dishes.find((d) => d.dish_id === dishId);
    if (!dish) return;
    const res = await adminApi.updateDish(dishId, {
      is_available: !dish.is_available,
    });
    if (res.data.success && res.data.data) {
      setDishes(dishes.map((d) => (d.dish_id === dishId ? res.data.data : d)));
    }
  };

  const openAddDialog = () => {
    setEditingDish(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      category_id: 0,
      is_available: true,
      image_url: undefined,
    });
    setImagePreview(null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dishes Management</CardTitle>
            <CardDescription>Manage food dishes and menu items</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Dish
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingDish ? "Edit Dish" : "Add New Dish"}
                </DialogTitle>
                <DialogDescription>
                  {editingDish
                    ? "Update dish information"
                    : "Create a new menu item"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="image">Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (VND)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number.parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category_id.toString()}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          category_id: Number.parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.category_id}
                            value={category.category_id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="available"
                      checked={formData.is_available}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_available: checked })
                      }
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingDish ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dishes.map((dish) => (
                <TableRow key={dish.dish_id}>
                  <TableCell className="font-medium">{dish.dish_id}</TableCell>
                  <TableCell>
                    {dish.image_url ? (
                      <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-xs text-gray-400 rounded">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{dish.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {dish.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryName(dish.category_id)}</TableCell>
                  <TableCell>{formatPrice(dish.price)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={dish.is_available ? "default" : "secondary"}
                    >
                      {dish.is_available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAvailability(dish.dish_id)}
                      >
                        {dish.is_available ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(dish)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
