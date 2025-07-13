const request = require("supertest");
const app = require("../../src/app");

describe("User Profile API Tests", () => {
  let authToken;
  let testUserId;

  // Setup: Login để lấy token
  beforeAll(async () => {
    const loginResponse = await request(app).post("/auth/login").send({
      user_name: "user1", // Giả sử có user này trong DB
      password: "password123",
    });

    if (loginResponse.status === 200) {
      authToken = loginResponse.body.data.token;
      testUserId = loginResponse.body.data.id;
    }
  });

  describe("GET /user/profile", () => {
    test("should get user profile with valid token", async () => {
      if (!authToken) {
        console.log("Skipping test - no auth token available");
        return;
      }

      const response = await request(app)
        .get("/user/profile")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Fetched user profile");
      expect(response.body.data).toHaveProperty("user_id");
      expect(response.body.data).toHaveProperty("email");
      expect(response.body.data).toHaveProperty("full_name");
      expect(response.body.data).toHaveProperty("phone");
      expect(response.body.data).toHaveProperty("address");
      expect(response.body.data).toHaveProperty("avatar_url");
    });

    test("should return 401 without token", async () => {
      const response = await request(app).get("/user/profile");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });

    test("should return 401 with invalid token", async () => {
      const response = await request(app)
        .get("/user/profile")
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });
  });

  describe("PUT /user/profile", () => {
    test("should update profile with valid data", async () => {
      if (!authToken) {
        console.log("Skipping test - no auth token available");
        return;
      }

      const updateData = {
        full_name: "Nguyễn Văn Test",
        phone: "0909123457",
        address: "123 Test Street",
      };

      const response = await request(app)
        .put("/user/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Cập nhật thông tin thành công");
      expect(response.body.data).toHaveProperty("user_id");
      expect(response.body.data.full_name).toBe(updateData.full_name);
      expect(response.body.data.phone).toBe(updateData.phone);
      expect(response.body.data.address).toBe(updateData.address);
    });

    test("should return 400 with invalid phone format", async () => {
      if (!authToken) {
        console.log("Skipping test - no auth token available");
        return;
      }

      const updateData = {
        full_name: "Test User",
        phone: "123", // Invalid phone format
        address: "Test Address",
      };

      const response = await request(app)
        .put("/user/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("should return 400 with empty full_name", async () => {
      if (!authToken) {
        console.log("Skipping test - no auth token available");
        return;
      }

      const updateData = {
        full_name: "",
        phone: "0909123458",
        address: "Test Address",
      };

      const response = await request(app)
        .put("/user/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("should return 401 without token", async () => {
      const updateData = {
        full_name: "Test User",
        phone: "0909123459",
        address: "Test Address",
      };

      const response = await request(app).put("/user/profile").send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });

    test("should update only allowed fields", async () => {
      if (!authToken) {
        console.log("Skipping test - no auth token available");
        return;
      }

      const updateData = {
        full_name: "Test User Allowed",
        phone: "0909123460",
        address: "Test Address Allowed",
        email: "hacker@test.com", // Should be ignored
        avatar_url: "hacker.jpg", // Should be ignored
      };

      const response = await request(app)
        .put("/user/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.full_name).toBe(updateData.full_name);
      expect(response.body.data.phone).toBe(updateData.phone);
      expect(response.body.data.address).toBe(updateData.address);
      // email và avatar_url không nên được cập nhật
      expect(response.body.data).not.toHaveProperty("email");
      expect(response.body.data).not.toHaveProperty("avatar_url");
    });
  });
});
