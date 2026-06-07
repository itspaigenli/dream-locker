import express from "express";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const queryMock = vi.fn();
const hashPasswordMock = vi.fn();
const comparePasswordMock = vi.fn();
const jwtSignMock = vi.fn();

vi.mock("../db/pool.js", () => ({
  default: {
    query: queryMock,
  },
}));

vi.mock("../utils/password.js", () => ({
  hashPassword: hashPasswordMock,
  comparePassword: comparePasswordMock,
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: jwtSignMock,
  },
}));

const { default: authRouter } = await import("./auth.js");

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRouter);
  return app;
};

describe("auth routes", () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    queryMock.mockReset();
    hashPasswordMock.mockReset();
    comparePasswordMock.mockReset();
    jwtSignMock.mockReset();
    process.env.JWT_SECRET = "test-secret";
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  describe("POST /api/auth/signup", () => {
    it("creates a new user and returns 201", async () => {
      hashPasswordMock.mockResolvedValue("hashed-password");
      queryMock.mockResolvedValue({
        rows: [
          {
            id: 1,
            username: "DreamUser",
            email: "user@example.com",
            role: "dreamer",
          },
        ],
      });

      const response = await request(createApp()).post("/api/auth/signup").send({
        username: "  DreamUser  ",
        email: "  USER@example.com  ",
        password: "ValidP@ss1",
      });

      expect(hashPasswordMock).toHaveBeenCalledWith("ValidP@ss1");
      expect(queryMock).toHaveBeenCalledWith(
        "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
        ["DreamUser", "user@example.com", "hashed-password", "dreamer"],
      );
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "User registered successfully",
        user: {
          id: 1,
          username: "DreamUser",
          email: "user@example.com",
          role: "dreamer",
        },
      });
    });

    it("returns 400 when signup validation fails", async () => {
      const response = await request(createApp()).post("/api/auth/signup").send({
        username: "ab",
        email: "not-an-email",
        password: "weak",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid email" });
      expect(hashPasswordMock).not.toHaveBeenCalled();
      expect(queryMock).not.toHaveBeenCalled();
    });

    it("returns 409 when the email already exists", async () => {
      hashPasswordMock.mockResolvedValue("hashed-password");
      queryMock.mockRejectedValue({
        code: "23505",
        constraint: "users_email_key",
      });

      const response = await request(createApp()).post("/api/auth/signup").send({
        username: "DreamUser",
        email: "user@example.com",
        password: "ValidP@ss1",
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: "Email already exists" });
    });


    it("returns 409 when the username already exists", async () => {
      hashPasswordMock.mockResolvedValue("hashed-password");
      queryMock.mockRejectedValue({
        code: "23505",
        constraint: "users_username_key",
      });

      const response = await request(createApp()).post("/api/auth/signup").send({
        username: "DreamUser",
        email: "user@example.com",
        password: "ValidP@ss1",
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: "Username already exists" });
    });
  })

  describe("POST /api/auth/signin", () => {
     it("returns 400 when identifier or password is missing", async () => {
      const response = await request(createApp()).post("/api/auth/signin").send({
        identifier: "",
        password: "ValidP@ss1",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Username/Email and password are required",
      });
      expect(queryMock).not.toHaveBeenCalled();
    });

    it("returns 401 when the password comparison fails", async () => {
      queryMock.mockResolvedValue({
        rows: [
          {
            id: 2,
            username: "DreamUser",
            role: "dreamer",
            password_hash: "stored-hash",
          },
        ],
      });

      comparePasswordMock.mockResolvedValue(false);

      const response = await request(createApp()).post("/api/auth/signin").send({
        identifier: "DreamUser",
        password: "wrong-password",
      });

      expect(comparePasswordMock).toHaveBeenCalledWith(
        "wrong-password",
        "stored-hash",
      );

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Invalid credentials" });
    });

  })
})