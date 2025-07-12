const request = require("supertest");
const app = require("../../src/app");
let adminToken;
let createdCategoryId;

describe("Admin Category CRUD API", () => {
  beforeAll(async () => {
    // Đăng nhập lấy token admin (giả sử đã có user admin)
    const res = await request(app)
      .post("/auth/login")
      .send({ user_name: "admin_main", password: "passadmin1" });
    adminToken = res.body.data?.token;
  });

  it("should return 401 if not authenticated", async () => {
    const res = await request(app).get("/admin/categories");
    expect(res.status).toBe(401);
  });

  it("should get all categories (empty or list)", async () => {
    const res = await request(app)
      .get("/admin/categories")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should create a new category", async () => {
    const res = await request(app)
      .post("/admin/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "TestCategory", description: "Test desc" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("category_id");
    createdCategoryId = res.body.data.category_id;
  });

  it("should not create duplicate category", async () => {
    const res = await request(app)
      .post("/admin/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "TestCategory", description: "Test desc" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should update category", async () => {
    const res = await request(app)
      .put(`/admin/categories/${createdCategoryId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "TestCategoryUpdated", description: "Updated desc" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("TestCategoryUpdated");
  });

  it("should return 404 when update not found", async () => {
    const res = await request(app)
      .put("/admin/categories/999999")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "NotFound", description: "desc" });
    expect(res.status).toBe(404);
  });

  it("should delete category", async () => {
    const res = await request(app)
      .delete(`/admin/categories/${createdCategoryId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 404 when delete not found", async () => {
    const res = await request(app)
      .delete(`/admin/categories/999999`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});
