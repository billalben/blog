import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app";
import User from "@/models/user";
import Token from "@/models/token";
import { createUserWithTokens } from "../helpers";

describe("PUT /api/v1/users/current", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("updates the current user profile", async () => {
    const { accessToken } = await createUserWithTokens();

    const res = await request(app)
      .put("/api/v1/users/current")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ firstName: "John", lastName: "Doe" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.firstName).toBe("John");
    expect(res.body.data.user.lastName).toBe("Doe");
  });

  it("returns 401 without auth token", async () => {
    const res = await request(app)
      .put("/api/v1/users/current")
      .send({ firstName: "John" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 401 when user does not exist", async () => {
    const { accessToken } = await createUserWithTokens();
    await User.deleteMany({});

    const res = await request(app)
      .put("/api/v1/users/current")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ firstName: "John" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Unauthorized: User not found");
  });

  it("returns 400 with invalid email", async () => {
    const { accessToken } = await createUserWithTokens();

    const res = await request(app)
      .put("/api/v1/users/current")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 with short username", async () => {
    const { accessToken } = await createUserWithTokens();

    const res = await request(app)
      .put("/api/v1/users/current")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ username: "ab" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 409 when email already exists", async () => {
    const { accessToken } = await createUserWithTokens();
    await User.create({
      username: "otheruser",
      email: "other@example.com",
      password: "Test1234!",
    });

    const res = await request(app)
      .put("/api/v1/users/current")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ email: "other@example.com" });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});
