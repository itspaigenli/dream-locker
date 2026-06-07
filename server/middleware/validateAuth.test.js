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

    it("returns 400 for an invalid email address", () => {
    const req = {
      body: {
        username: "DreamUser",
        email: "not-an-email",
        password: "ValidP@ss1",
      },
    };
    const res = createResponse();

    validateSignup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid email" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 for a password that does not meet complexity rules", () => {
    const req = {
      body: {
        username: "DreamUser",
        email: "user@example.com",
        password: "password",
      },
    };
    const res = createResponse();

    validateSignup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when the username is shorter than 3 characters", () => {
    const req = {
      body: {
        username: "ab",
        email: "user@example.com",
        password: "ValidP@ss1",
      },
    };
    const res = createResponse();

    validateSignup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Username must be between 3 and 20 characters",
    });
    expect(next).not.toHaveBeenCalled();
  });

});