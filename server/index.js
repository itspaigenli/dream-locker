import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pool from "./db/pool.js";
import authRoutes from "./routes/auth.js";
import { authMiddleware, requireRole } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Dream Evidence Locker API is running" });
});

app.get("/api/reports", async (req, res) => {
  const result = await pool.query(`
    SELECT
      dream_reports.id,
      dream_reports.title,
      dream_reports.description,
      dream_reports.symbols,
      dream_reports.location,
      dream_reports.visibility,
      dream_reports.archived,
      dream_reports.created_at,
      dream_reports.updated_at
    FROM dream_reports
    WHERE dream_reports.visibility = 'public'
      AND dream_reports.archived = false
    ORDER BY dream_reports.created_at DESC
  `);

  res.json(result.rows);
});

app.get("/api/reports/:id", async (req, res) => {
  const result = await pool.query(
    `
      SELECT
        dream_reports.id,
        dream_reports.title,
        dream_reports.description,
        dream_reports.symbols,
        dream_reports.location,
        dream_reports.visibility,
        dream_reports.archived,
        dream_reports.created_at,
        dream_reports.updated_at
      FROM dream_reports
      WHERE dream_reports.id = $1
        AND dream_reports.visibility = 'public'
        AND dream_reports.archived = false
    `,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ message: "Report not found" });
    return;
  }

  res.json(result.rows[0]);
});

// Only investigators or admins can access archived files!
app.get("/api/archive", authMiddleware, requireRole(['investigator', 'admin']), async (req, res) => {
  const result = await pool.query(`
    SELECT
      dream_reports.id,
      dream_reports.title,
      dream_reports.description,
      dream_reports.symbols,
      dream_reports.location,
      dream_reports.visibility,
      dream_reports.archived,
      dream_reports.created_at,
      dream_reports.updated_at
    FROM dream_reports
    WHERE dream_reports.archived = true
    ORDER BY dream_reports.updated_at DESC
  `);

  res.json(result.rows);
});

// Anyone with a valid account can create a report.
app.post("/api/reports", authMiddleware, async (req, res) => {
  const { title, description, symbols, location, visibility } = req.body;
  const userId = req.user.id;

  const result = await pool.query(
    `
      INSERT INTO dream_reports (
        user_id,
        title,
        description,
        symbols,
        location,
        visibility
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [userId, title, description, symbols, location, visibility]
  );

  res.status(201).json(result.rows[0]);
});

app.put("/api/reports/:id", authMiddleware, async (req, res) => {
  const { title, description, symbols, location, visibility } = req.body;

  const result = await pool.query(
    `
      UPDATE dream_reports
      SET
        title = $1,
        description = $2,
        symbols = $3,
        location = $4,
        visibility = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
        AND ($8 = 'admin'
        OR (user_id = $7 AND archived = false))
      RETURNING *
    `,
    [title, description, symbols, location, visibility, req.params.id, req.user.id, req.user.role]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ message: "Report not found" });
    return;
  }

  res.json(result.rows[0]);
});

app.get("/api/report-links", authMiddleware, requireRole(["investigator", "admin"]), async (req, res) => {
  const result = await pool.query(`
    SELECT
      report_links.id,
      report_links.source_report_id,
      source_report.title AS source_title,
      report_links.target_report_id,
      target_report.title AS target_title,
      report_links.reason,
      report_links.created_at
    FROM report_links
    JOIN dream_reports AS source_report
      ON source_report.id = report_links.source_report_id
    JOIN dream_reports AS target_report
      ON target_report.id = report_links.target_report_id
    ORDER BY report_links.created_at DESC
  `);

  res.json(result.rows);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
