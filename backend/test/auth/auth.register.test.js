const request = require("supertest");
const app = require("../../src/app"); // Ensure app.js exports app

describe("POST /auth/register", () => {
  const userData = {
    user_name: "testuser_" + Date.now(),
    email: "testuser_" + Date.now() + "@example.com",
    full_name: "Test User",
    phone: "0909" + Math.floor(Math.random() * 1000000),
    password: "123456",
  };

  it("Register successfully", async () => {
    const res = await request(app).post("/auth/register").send(userData);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("user_id");
    expect(res.body.data).toHaveProperty("user_name", userData.user_name);
    expect(res.body.data).toHaveProperty("email", userData.email);
  });

  it("Error when email already exists", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        ...userData,
        user_name: userData.user_name + "x",
        phone: "0909" + Math.floor(Math.random() * 1000000),
      });
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Email already exists/);
  });

  it("Error when required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({});
    expect(res.body.success).toBe(false);
  });
});
