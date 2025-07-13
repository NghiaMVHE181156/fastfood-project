const request = require("supertest");
const app = require("../../src/app");

// Thông tin admin test (cần có sẵn trong DB)
const adminLogin = {
  user_name: "admin_main",
  password: "passadmin1",
};

let token;
let createdDishId;

beforeAll(async () => {
  // Đăng nhập lấy token admin
  const res = await request(app).post("/auth/login").send(adminLogin);
  console.log("LOGIN RESPONSE:", res.body);
  if (!res.body.success || !res.body.data?.token) {
    throw new Error("Login failed: " + JSON.stringify(res.body));
  }
  token = res.body.data?.token;
});

describe("CRUD Dish API", () => {
  it("GET /admin/dishes - lấy danh sách món ăn", async () => {
    const res = await request(app)
      .get("/admin/dishes")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /admin/dishes - thêm món ăn mới thành công", async () => {
    const dish = {
      name: "UnitTest Dish " + Date.now(),
      description: "Món ăn test tự động",
      price: 12345,
      image_url: "https://test.com/image.jpg",
      category_id: 1,
      is_available: true,
    };
    const res = await request(app)
      .post("/admin/dishes")
      .set("Authorization", `Bearer ${token}`)
      .send(dish);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("dish_id");
    createdDishId = res.body.data.dish_id;
  });

  it("POST /admin/dishes - lỗi trùng tên", async () => {
    const dish = {
      name: "UnitTest Dish Duplicate",
      description: "Món ăn test duplicate",
      price: 12345,
      image_url: "https://test.com/image.jpg",
      category_id: 1,
      is_available: true,
    };
    // Tạo lần 1
    await request(app)
      .post("/admin/dishes")
      .set("Authorization", `Bearer ${token}`)
      .send(dish);
    // Tạo lần 2 (trùng tên)
    const res = await request(app)
      .post("/admin/dishes")
      .set("Authorization", `Bearer ${token}`)
      .send(dish);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("DISH_NAME_DUPLICATE");
  });

  it("POST /admin/dishes - lỗi category không tồn tại", async () => {
    const dish = {
      name: "UnitTest Dish InvalidCat " + Date.now(),
      description: "Món ăn test category",
      price: 12345,
      image_url: "https://test.com/image.jpg",
      category_id: 99999,
      is_available: true,
    };
    const res = await request(app)
      .post("/admin/dishes")
      .set("Authorization", `Bearer ${token}`)
      .send(dish);
    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("CATEGORY_NOT_FOUND");
  });

  it("PUT /admin/dishes/:id - cập nhật món ăn thành công", async () => {
    const res = await request(app)
      .put(`/admin/dishes/${createdDishId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "UnitTest Dish Updated",
        price: 54321,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("UnitTest Dish Updated");
    expect(res.body.data.price).toBe(54321);
  });

  it("PUT /admin/dishes/:id - lỗi không tìm thấy", async () => {
    const res = await request(app)
      .put("/admin/dishes/999999")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "NotFound" });
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("DISH_NOT_FOUND");
  });

  it("DELETE /admin/dishes/:id - xóa món ăn thành công", async () => {
    const res = await request(app)
      .delete(`/admin/dishes/${createdDishId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("DELETE /admin/dishes/:id - lỗi không tìm thấy", async () => {
    const res = await request(app)
      .delete("/admin/dishes/999999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("DISH_NOT_FOUND");
  });
});
