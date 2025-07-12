const request = require("supertest");
const app = require("../../src/app");

describe("JWT authentication middleware", () => {
  let token;
  beforeAll(async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ user_name: "jonnytran", password: "jonnytran411" });
    console.log("Login response:", res.body);
    token = res.body.data.token;
  });

  it("Access protected route with valid token", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", "Bearer " + token);
    console.log("Valid token response:", res.body);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(true);
  });

  it("Access protected route without token", async () => {
    const res = await request(app).get("/auth/profile");
    console.log("No token response:", res.body);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Missing authentication token/);
  });

  it("Access protected route with invalid token", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", "Bearer abcxyz");
    console.log("Invalid token response:", res.body);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid or expired token/);
  });
});
