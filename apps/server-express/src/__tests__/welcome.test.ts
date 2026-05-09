import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@/app";

describe("GET /", () => {
  it("returns welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Welcome to the Blog API!");
  });
});

describe("GET /api/v1/", () => {
  it("returns API status", async () => {
    const res = await request(app).get("/api/v1/");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.version).toBe("1.0.0");
    expect(res.body.data.docs).toBe("/docs");
  });
});
