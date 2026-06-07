import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";

const jwtVerifySpy = vi.spyOn(jwt, "verify");
const { authMiddleware, requireRole } = await import("./authMiddleware.js");

const createResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("authMiddleware", () => {
  let next;
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    next = vi.fn();
    process.env.JWT_SECRET = "test-secret";
    jwtVerifySpy.mockReset();
  });

  afterEach(() => {
    jwtVerifySpy.mockReset();
  });

  afterAll(() => {
    jwtVerifySpy.mockRestore();
    process.env.JWT_SECRET = originalJwtSecret;
  });

  it("returns 401 when no token is provided", () => {
    const req = { headers: {} };
    const res = createResponse();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Access denied. No token provided.",
    });
    expect(jwtVerifySpy).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("verifies the bearer token, attaches the user, and calls next", () => {
    const verifiedUser = { id: 7, username: "dreamer", role: "admin" };
    const req = { headers: { authorization: "Bearer signed.jwt.token" } };
    const res = createResponse();

    jwtVerifySpy.mockReturnValue(verifiedUser);

    authMiddleware(req, res, next);

    expect(jwtVerifySpy).toHaveBeenCalledWith("signed.jwt.token", "test-secret");
    expect(req.user).toEqual(verifiedUser);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("returns 403 when token verification fails", () => {
    const req = { headers: { authorization: "Bearer invalid.token" } };
    const res = createResponse();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    jwtVerifySpy.mockImplementation(() => {
      throw new Error("invalid token");
    });

    authMiddleware(req, res, next);

    expect(consoleErrorSpy).toHaveBeenCalledWith("invalid token");
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "No access in your role." });
    expect(next).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

describe("requireRole", () => {
  let next;
  let res;

  beforeEach(() => {
    next = vi.fn();

    res = {
      status: function () { return this; },
      json: function () { return this; }
    };

    vi.spyOn(res, "status");
    vi.spyOn(res, "json");
  });

  it("returns 401 when user is missing", () => {
    const req = {};

    requireRole(["admin"])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Login first." });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when the user role is not allowed", () => {
    const req = { user: { role: "user" } };

    requireRole(["investigator", "admin"])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Sorry, You do not have permission to access this resource.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when the user role is allowed", () => {
    const req = { user: { role: "investigator" } };

    requireRole(["investigator", "admin"])(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
})