import express from "express";
import cors from "cors";
import sessionRouter from "./routes/session.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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
