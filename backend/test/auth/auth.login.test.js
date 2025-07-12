const request = require("supertest");
const app = require("../../src/app");

describe("POST /auth/login", () => {
  const user = {
    user_name: "jonnytran",
    password: "jonnytran411",
  };

  it("Login successfully", async () => {
    const res = await request(app).post("/auth/login").send(user);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data).toHaveProperty("role");
    expect(res.body.data).toHaveProperty("id");
  });

  it("Wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ ...user, password: "wrong_password" });
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Incorrect password/);
  });

  it("Account does not exist", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ user_name: "does_not_exist", password: "jonnytran411" });
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Account does not exist/);
  });
});
