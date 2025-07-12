const request = require("supertest");
const express = require("express");
const { requireRole } = require("../../src/middlewares/role.middleware");
const authMiddleware = require("../../src/middlewares/auth.middleware");
const app = express();
app.use(express.json());

// Test route for admin only
app.get("/admin-only", authMiddleware, requireRole(["admin"]), (req, res) => {
  res.json({ success: true, message: "Admin access granted" });
});

// Test route for user only
app.get("/user-only", authMiddleware, requireRole(["user"]), (req, res) => {
  res.json({ success: true, message: "User access granted" });
});

describe("Role authorization middleware", () => {
  let adminToken, userToken;
  beforeAll(async () => {
    // Admin login
    const resAdmin = await request(require("../../src/app"))
      .post("/auth/login")
      .send({ user_name: "admin_main", password: "passasadmin1" });
    adminToken = resAdmin.body.data.token;
    // User login
    const resUser = await request(require("../../src/app"))
      .post("/auth/login")
      .send({ user_name: "jonnytran", password: "jonnytran411" });
    userToken = resUser.body.data.token;
  });

  it("Admin successfully accesses admin-only route", async () => {
    const res = await request(app)
      .get("/admin-only")
      .set("Authorization", "Bearer " + adminToken);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/Admin access granted/);
  });

  it("User is forbidden from accessing admin-only route", async () => {
    const res = await request(app)
      .get("/admin-only")
      .set("Authorization", "Bearer " + userToken);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(
      /You are not authorized to access this resource/i
    );
  });

  it("User successfully accesses user-only route", async () => {
    const res = await request(app)
      .get("/user-only")
      .set("Authorization", "Bearer " + userToken);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/User access granted/);
  });
});
