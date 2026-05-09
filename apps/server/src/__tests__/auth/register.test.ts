import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app";
import User from "@/models/user";
import Token from "@/models/token";

const VALID_USER = {
  email: "test@example.com",
  password: "Test1234!",
};

describe("POST /api/v1/auth/register", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("registers a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(VALID_USER);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("test@example.com");
    expect(res.body.data.user.role).toBe("user");
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
  });

  it("returns 400 when email is missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ password: "Test1234!" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when password is too short", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "test@example.com", password: "12345" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 409 when email already exists", async () => {
    await request(app).post("/api/v1/auth/register").send(VALID_USER);

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(VALID_USER);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});
