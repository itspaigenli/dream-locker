import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const queryMock = vi.fn();

vi.mock("./db/pool.js", () => ({
  default: {
    query: queryMock,
  },
}));

vi.mock("./middleware/authMiddleware.js", () => ({
  authMiddleware: (req, _res, next) => {
    req.user = { id: 7, role: "admin" };
    next();
  },
  requireRole: () => (_req, _res, next) => next(),
}));

vi.mock("./routes/auth.js", async () => {
  const express = await import("express");
  return {
    default: express.Router(),
  };
});

let app;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  ({ default: app } = await import("./index.js"));
});

describe("report routes", () => {
  beforeEach(() => {
    queryMock.mockReset();
  });

  it("returns public reports from GET /api/reports", async () => {
    const reports = [
      {
        id: 1,
        title: "Moon Hallway",
        description: "A looping corridor dream",
        symbols: "moon,door",
        location: "hallway",
        visibility: "public",
        archived: false,
      },
    ];
    queryMock.mockResolvedValue({ rows: reports });

    const response = await request(app).get("/api/reports");

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock.mock.calls[0][0]).toContain("FROM dream_reports");
    expect(queryMock.mock.calls[0][0]).toContain("visibility = 'public'");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(reports);
  });

  it("returns public report from GET /api/reports/:id", async () => {
    const report = {
      id: 2,
      title: "Red Forest",
      description: "Trees glowing at dusk",
      symbols: "forest,red light",
      location: "woods",
      visibility: "public",
      archived: false,
    };
    queryMock.mockResolvedValue({ rows: [report] });

    const response = await request(app).get("/api/reports/2");

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("WHERE dream_reports.id = $1"),
      ["2"],
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(report);
  });

});
