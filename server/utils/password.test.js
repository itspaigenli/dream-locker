import { describe, expect, it } from "vitest";

import { comparePassword, hashPassword } from "./password.js";

describe("password utils", () => {
  it("hashes a password and validates it successfully", async () => {
    const password = "S3cureP@ssword!";

    const hashedPassword = await hashPassword(password);

    expect(hashedPassword).not.toBe(password);
    expect(typeof hashedPassword).toBe("string");
    await expect(comparePassword(password, hashedPassword)).resolves.toBe(true);
  });

  
});
