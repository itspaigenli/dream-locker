import { describe, expect, it } from "vitest";
import { authenticatedFetch } from "./authenticatedFetch.js";

// Test 1: Sends token in Authorization header
describe("authenticatedFetch", () => {
  it("sends the token in the Authorization header", async () => {
    let requestOptions = {};

    global.fetch = async (url, options) => {
      requestOptions = options;

      return {
        ok: true,
        json: async () => ({
          message: "Success",
        }),
      };
    };

    await authenticatedFetch("/archive", "fake-token");

    expect(requestOptions.headers.Authorization).toBe("Bearer fake-token");
  });
});

// Test 2: Throws error when request fails
describe("authenticatedFetch", () => {
  it("throws an error when the request fails", async () => {
    global.fetch = async () => ({
      ok: false,
      json: async () => ({
        error: "Not authorized",
      }),
    });

    await expect(authenticatedFetch("/archive", "bad-token")).rejects.toThrow(
      "Not authorized",
    );
  });
});
