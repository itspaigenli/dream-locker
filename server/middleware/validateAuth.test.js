import { beforeEach, describe, expect, it, vi } from "vitest";

import { validateSignup } from "./validateAuth.js";

const createResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("validateSignup", () => {
  let next;

  beforeEach(() => {
    next = vi.fn();
  });

  it("calls next for a valid signup request with username and email", () => {
    const req = {
      body: {
        username: "DreamUser",
        email: "USER@Example.COM",
        password: "ValidP@ss1",
      },
    };
    const res = createResponse();

    validateSignup(req, res, next);

    expect(req.body.username).toBe("DreamUser");
    expect(req.body.email).toBe("user@example.com");
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

   it("returns 400 when required fields are missing", () => {
    const req = {
      body: {
        username: "ab",
        email: "",
        password: "ValidP@ss1",
      },
    };
    const res = createResponse();

    validateSignup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "All fields are required" });
    expect(next).not.toHaveBeenCalled();
  });

});