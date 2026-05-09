import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app";
import User from "@/models/user";
import Token from "@/models/token";
import { createUserWithTokens } from "../helpers";

describe("GET /api/v1/users/current", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("returns the current user profile", async () => {
    const { user, accessToken } = await createUserWithTokens();

    const res = await request(app)
      .get("/api/v1/users/current")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data.user.username).toBe(user.username);
    expect(res.body.data.user.role).toBe(user.role);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it("returns 401 without auth token", async () => {
    const res = await request(app).get("/api/v1/users/current");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 401 when user does not exist", async () => {
    const { accessToken } = await createUserWithTokens();
    await User.deleteMany({});

    const res = await request(app)
      .get("/api/v1/users/current")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Unauthorized: User not found");
  });
});
