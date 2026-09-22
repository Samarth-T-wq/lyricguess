import express from "express";
import cors from "cors";
import sessionRouter from "./routes/session.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed browser origin(s). Unset => allow all, so the MVP works as soon as
// it's deployed; set CORS_ORIGIN to the Vercel URL to lock it down later.
// Accepts a comma-separated list.
const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
  : "*";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Session routes
app.use("/api/session", sessionRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
