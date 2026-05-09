import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app";
import User from "@/models/user";
import Token from "@/models/token";
import { createUserWithTokens } from "../helpers";

describe("GET /api/v1/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("returns all users for admin", async () => {
    const { accessToken } = await createUserWithTokens({ role: "admin" });
    await User.create({
      username: "user2",
      email: "user2@example.com",
      password: "Test1234!",
    });

    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta.count).toBe(2);
  });

  it("returns 403 for non-admin users", async () => {
    const { accessToken } = await createUserWithTokens({ role: "user" });

    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("returns 401 without auth token", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("supports pagination", async () => {
    const { accessToken } = await createUserWithTokens({
      role: "admin",
      username: "admin",
    });

    for (let i = 0; i < 5; i++) {
      await User.create({
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: "Test1234!",
      });
    }

    const res = await request(app)
      .get("/api/v1/users")
      .query({ page: 1, page_size: 3 })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.meta.count).toBe(6);
    expect(res.body.meta.next).toContain("page=2");
    expect(res.body.meta.previous).toBeNull();
  });
});
