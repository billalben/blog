import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app";
import User from "@/models/user";
import Token from "@/models/token";
import { createUserWithTokens, getRefreshTokenCookie } from "../helpers";

describe("POST /api/v1/auth/refresh-token", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("refreshes access token with valid refresh token", async () => {
    const { refreshToken } = await createUserWithTokens();

    const res = await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", getRefreshTokenCookie(refreshToken));

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("returns 400 when no refresh token cookie is sent", async () => {
    const res = await request(app).post("/api/v1/auth/refresh-token");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
