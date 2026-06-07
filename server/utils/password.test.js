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

  it("returns false when the password does not match the hash", async () => {
    const hashedPassword = await hashPassword("CorrectHorseBatteryStaple");

    await expect(
      comparePassword("wrong-password", hashedPassword),
    ).resolves.toBe(false);
  });

  it("returns false when either password input is missing", async () => {
    await expect(comparePassword("", "hashed-password")).resolves.toBe(false);
    await expect(comparePassword("password", "")).resolves.toBe(false);
    await expect(comparePassword("", "")).resolves.toBe(false);
  });
});
