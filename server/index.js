import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Dream Evidence Locker API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
