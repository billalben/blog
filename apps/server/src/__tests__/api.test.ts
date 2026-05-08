import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "@/app";
import User from "@/models/user";
import Token from "@/models/token";

describe("GET /", () => {
  it("returns welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Welcome to the Blog API!" });
  });
});

describe("GET /api/v1/", () => {
  it("returns API status", async () => {
    const res = await request(app).get("/api/v1/");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.version).toBe("1.0.0");
  });
});

describe("POST /api/v1/auth/register", () => {
  const validUser = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("registers a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.user.role).toBe("user");
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.password).toBeUndefined();
  });

  it("returns 400 when email is missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("returns 400 when password is too short", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "test@example.com", password: "12345" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("returns 409 when email already exists", async () => {
    await request(app).post("/api/v1/auth/register").send(validUser);

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.status).toBe("error");
  });
});

describe("POST /api/v1/auth/login", () => {
  const credentials = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("logs in with valid credentials", async () => {
    await request(app).post("/api/v1/auth/register").send(credentials);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send(credentials);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.accessToken).toBeDefined();
  });

  it("returns 401 with wrong password", async () => {
    await request(app).post("/api/v1/auth/register").send(credentials);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe("error");
  });

  it("returns 401 with non-existent email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "nonexistent@example.com", password: "password123" });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe("error");
  });
});

describe("POST /api/v1/auth/refresh-token", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("refreshes access token with valid refresh token", async () => {
    const registerRes = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    const cookies = registerRes.headers["set-cookie"];
    const refreshTokenCookie = Array.isArray(cookies)
      ? cookies.find((c: string) => c.startsWith("refreshToken="))
      : cookies;

    const res = await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", refreshTokenCookie || "");

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("returns 400 when no refresh token cookie is sent", async () => {
    const res = await request(app).post("/api/v1/auth/refresh-token");
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });
});

describe("POST /api/v1/auth/logout", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("logs out successfully", async () => {
    const registerRes = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    const accessToken = registerRes.body.accessToken;

    const res = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(204);
  });

  it("returns 401 without auth token", async () => {
    const res = await request(app).post("/api/v1/auth/logout");
    expect(res.status).toBe(401);
    expect(res.body.status).toBe("error");
  });
});
