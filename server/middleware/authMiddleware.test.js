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

})