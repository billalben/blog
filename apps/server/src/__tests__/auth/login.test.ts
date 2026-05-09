import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app";
import User from "@/models/user";
import Token from "@/models/token";
import { createUserInDb, VALID_PASSWORD } from "../helpers";

const TEST_CREDENTIALS = {
  email: "test@example.com",
  password: VALID_PASSWORD,
};

describe("POST /api/v1/auth/login", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  it("logs in with valid credentials", async () => {
    await createUserInDb();

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send(TEST_CREDENTIALS);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("test@example.com");
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("returns 401 with wrong password", async () => {
    await createUserInDb();

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 401 with non-existent email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "nonexistent@example.com", password: VALID_PASSWORD });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
