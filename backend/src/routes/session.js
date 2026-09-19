import express from "express";
import { createSession, getSession } from "../services/sessionStore.js";
import { buildQuestion } from "../services/questionBuilder.js";

const router = express.Router();

// POST /api/session/start
router.post("/start", (req, res) => {
  const { genre, difficulty, mode } = req.body;

  if (!genre || !difficulty || !mode) {
    return res.status(400).json({ error: "Missing genre, difficulty, or mode" });
  }

  const result = createSession(genre, difficulty, mode);

  if (result.error) {
    return res.json({ error: result.error });
  }

  const { sessionId, session } = result;
  const question = buildQuestion(sessionId, 0, session.order[0], genre, difficulty, mode);

  res.json({
    sessionId,
    totalRounds: session.order.length,
    currentRound: 1,
    question
  });
});

export default router;
