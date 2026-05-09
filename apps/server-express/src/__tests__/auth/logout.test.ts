import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app";
import User from "@/models/user";
import Token from "@/models/token";
import { createUserWithTokens } from "../helpers";

describe("POST /api/v1/auth/logout", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("logs out successfully", async () => {
    const { accessToken } = await createUserWithTokens();

    const res = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(204);
  });

  it("returns 401 without auth token", async () => {
    const res = await request(app).post("/api/v1/auth/logout");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
