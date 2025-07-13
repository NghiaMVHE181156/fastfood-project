const request = require("supertest");
const app = require("../../src/app");
const { poolPromise } = require("../../src/config/db");

let adminToken;
let createdShipperId;
// Random hóa dữ liệu test để tránh trùng lặp
const rand = Math.floor(Math.random() * 1000000);
const testUserName = `shipper_test${rand}`;
const testEmail = `shipper_test${rand}@fastfood.vn`;
const testPhone = `09${rand.toString().padStart(8, "0")}`;
const testEmailUpdate = `shipper_test${rand}_update@fastfood.vn`;
const testPhoneUpdate = `08${rand.toString().padStart(8, "0")}`;

describe("Admin Shipper CRUD", () => {
  beforeAll(async () => {
    // Đăng nhập lấy token admin
    const res = await request(app)
      .post("/auth/login")
      .send({ user_name: "admin_main", password: "passadmin1" });
    adminToken = res.body.data.token;
  });

  it("GET /admin/shippers - lấy danh sách shipper", async () => {
    const res = await request(app)
      .get("/admin/shippers")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty("shipper_id");
    expect(res.body.data[0]).toHaveProperty("user_name");
    expect(res.body.data[0]).toHaveProperty("created_at");
  });

  it("POST /admin/shippers - tạo mới shipper", async () => {
    const res = await request(app)
      .post("/admin/shippers")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        user_name: testUserName,
        full_name: "Nguyễn Test",
        email: testEmail,
        phone: testPhone,
        password: "test1234",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("shipper_id");
    createdShipperId = res.body.data.shipper_id;
  });

  it("POST /admin/shippers - lỗi duplicate email", async () => {
    const res = await request(app)
      .post("/admin/shippers")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        user_name: testUserName + "_dup",
        full_name: "Nguyễn Test",
        email: testEmail, // trùng email
        phone: testPhone + "1",
        password: "test1234",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("SHIPPER_EMAIL_DUPLICATE");
  });

  it("PUT /admin/shippers/:id - update profile", async () => {
    const res = await request(app)
      .put(`/admin/shippers/${createdShipperId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        full_name: "Nguyễn Test Updated",
        email: testEmailUpdate,
        phone: testPhoneUpdate,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.full_name).toBe("Nguyễn Test Updated");
    expect(res.body.data.email).toBe(testEmailUpdate);
  });

  it("PUT /admin/shippers/:id - lỗi not found", async () => {
    const res = await request(app)
      .put(`/admin/shippers/999999`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        full_name: "Not Exist",
        email: `notexist${rand}@fastfood.vn`,
        phone: `0111${rand}`,
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("SHIPPER_NOT_FOUND");
  });

  it("DELETE /admin/shippers/:id - xóa shipper", async () => {
    const res = await request(app)
      .delete(`/admin/shippers/${createdShipperId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("DELETE /admin/shippers/:id - lỗi not found", async () => {
    const res = await request(app)
      .delete(`/admin/shippers/999999`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("SHIPPER_NOT_FOUND");
  });
});
