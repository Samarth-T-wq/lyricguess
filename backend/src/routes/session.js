import express from "express";
import { createSession, getSession, updateSession } from "../services/sessionStore.js";
import { buildQuestion } from "../services/questionBuilder.js";

const router = express.Router();

const POINTS = { easy: 10, medium: 20, hard: 30 };

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

// POST /api/session/answer
router.post("/answer", (req, res) => {
  const { sessionId, questionId, choiceId } = req.body;

  const session = getSession(sessionId);
  if (!session) {
    return res.json({ error: "SESSION_EXPIRED" });
  }

  // Idempotent replay for duplicate submissions
  if (session.answered[questionId]) {
    return res.json(session.answered[questionId]);
  }

  const idx = session.round;
  const item = session.order[idx];
  const correctLabel = session.mode === "song" ? item.song : item.artist;
  const correct = choiceId === correctLabel;

  if (correct) {
    session.score += POINTS[session.difficulty];
    session.streak += 1;
    session.correctCount += 1;
    session.bestStreak = Math.max(session.bestStreak, session.streak);
  } else {
    session.streak = 0;
  }

  session.round += 1;
  const isComplete = session.round >= session.order.length;

  const result = {
    correct,
    correctChoiceId: correctLabel,
    score: session.score,
    streak: session.streak,
    bestStreak: session.bestStreak,
    currentRound: session.round + 1,
    isComplete,
    nextQuestion: isComplete ? null : buildQuestion(sessionId, session.round, session.order[session.round], session.genre, session.difficulty, session.mode),
    results: isComplete ? {
      sessionId,
      finalScore: session.score,
      correctCount: session.correctCount,
      totalRounds: session.order.length,
      accuracy: session.correctCount / session.order.length,
      bestStreak: session.bestStreak
    } : null
  };

  session.answered[questionId] = result;
  updateSession(sessionId, session);

  res.json(result);
});

export default router;
