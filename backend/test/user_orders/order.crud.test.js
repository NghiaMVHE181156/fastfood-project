const request = require("supertest");
const app = require("../../src/app");

describe("User Order API Tests", () => {
  let authToken;
  let testOrderId;

  // Setup: Login để lấy token
  beforeAll(async () => {
    const loginResponse = await request(app).post("/auth/login").send({
      user_name: "jonnytran",
      password: "jonnytran411",
    });

    if (loginResponse.status === 200) {
      authToken = loginResponse.body.data.token;
    }
  });

  describe("POST /orders", () => {
    test("should create a new order successfully", async () => {
      const orderData = {
        items: [
          { dish_id: 1, quantity: 2 },
          { dish_id: 3, quantity: 1 },
        ],
        address: "123 Lê Lợi, Quận 1, TP.HCM",
        payment_method: "COD",
      };

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("order_id");
      expect(response.body.data).toHaveProperty("total_amount");
      expect(response.body.data).toHaveProperty("items");

      testOrderId = response.body.data.order_id;
    });

    test("should fail with invalid dish_id", async () => {
      const orderData = {
        items: [
          { dish_id: 999, quantity: 1 }, // Dish không tồn tại
        ],
        address: "123 Lê Lợi, Quận 1, TP.HCM",
        payment_method: "COD",
      };

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should fail with invalid payment method", async () => {
      const orderData = {
        items: [{ dish_id: 1, quantity: 1 }],
        address: "123 Lê Lợi, Quận 1, TP.HCM",
        payment_method: "INVALID", // Payment method không hợp lệ
      };

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should fail without authentication", async () => {
      const orderData = {
        items: [{ dish_id: 1, quantity: 1 }],
        address: "123 Lê Lợi, Quận 1, TP.HCM",
        payment_method: "COD",
      };

      const response = await request(app).post("/orders").send(orderData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /orders/history", () => {
    test("should get order history successfully", async () => {
      const response = await request(app)
        .get("/orders/history")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("orders");
      expect(response.body.data).toHaveProperty("pagination");
      expect(Array.isArray(response.body.data.orders)).toBe(true);
    });

    test("should get order history with pagination", async () => {
      const response = await request(app)
        .get("/orders/history?page=1&limit=5")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
    });

    test("datetime fields in order history must be in VN format", async () => {
      const VN_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      const response = await request(app)
        .get("/orders/history")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const orders = response.body.data.orders;
      for (const order of orders) {
        expect(order.created_at).toMatch(VN_DATETIME_REGEX);
        expect(order.updated_at).toMatch(VN_DATETIME_REGEX);
      }
    });

    test("should fail without authentication", async () => {
      const response = await request(app).get("/orders/history");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /orders/:id", () => {
    test("should get order detail successfully", async () => {
      if (!testOrderId) {
        console.log("Skipping test - no test order ID available");
        return;
      }

      const response = await request(app)
        .get(`/orders/${testOrderId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("order_id");
      expect(response.body.data).toHaveProperty("items");
      expect(response.body.data).toHaveProperty("delivery_logs");
      expect(Array.isArray(response.body.data.items)).toBe(true);
      expect(Array.isArray(response.body.data.delivery_logs)).toBe(true);
    });

    test("datetime fields in order detail must be in VN format", async () => {
      const VN_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      if (!testOrderId) return;

      const response = await request(app)
        .get(`/orders/${testOrderId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const order = response.body.data;
      expect(order.created_at).toMatch(VN_DATETIME_REGEX);
      expect(order.updated_at).toMatch(VN_DATETIME_REGEX);

      // Kiểm tra delivery_logs
      for (const log of order.delivery_logs) {
        expect(log.timestamp).toMatch(VN_DATETIME_REGEX);
      }
    });

    test("should fail with invalid order ID", async () => {
      const response = await request(app)
        .get("/orders/999999")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test("should fail without authentication", async () => {
      const response = await request(app).get("/orders/1");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
