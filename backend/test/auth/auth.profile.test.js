const request = require("supertest");
const app = require("../../src/app");

describe("GET /auth/profile", () => {
  let token;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post("/auth/login")
      .send({ user_name: "jonnytran", password: "jonnytran411" });
    console.log("Login response:", res.body);
    token = res.body.data.token;
  });

  it("Get profile successfully", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", "Bearer " + token);
    console.log("Profile response:", res.body);
    expect(res.body).toBeDefined();
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("user_id");
    expect(res.body.data).toHaveProperty("user_name");
  });

  it("Missing token", async () => {
    const res = await request(app).get("/auth/profile");
    console.log("Missing token response:", res.body);
    expect(res.body).toBeDefined();
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Missing authentication token/);
  });

  it("Invalid token", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", "Bearer abcxyz");
    console.log("Invalid token response:", res.body);
    expect(res.body).toBeDefined();
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid or expired token/);
  });
});
