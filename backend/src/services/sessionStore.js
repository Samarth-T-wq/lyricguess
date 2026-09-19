import { getSongPool } from "./songData.js";

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const sessions = new Map();

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createSession(genre, difficulty, mode) {
  const pool = getSongPool(genre, difficulty);
  const TOTAL_ROUNDS = 10;

  if (pool.length < 4) {
    return { error: "INSUFFICIENT_SONGS" };
  }

  // Shuffle and take up to TOTAL_ROUNDS
  const order = shuffle(pool).slice(0, Math.min(TOTAL_ROUNDS, pool.length));

  const sessionId = "sess_" + Math.random().toString(36).slice(2, 9);
  const session = {
    genre,
    difficulty,
    mode,
    order,
    round: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    answered: {},
    createdAt: Date.now()
  };

  sessions.set(sessionId, session);

  // Schedule cleanup
  setTimeout(() => {
    sessions.delete(sessionId);
  }, SESSION_TTL_MS);

  return { sessionId, session };
}

export function getSession(sessionId) {
  return sessions.get(sessionId);
}

export function updateSession(sessionId, updates) {
  const session = sessions.get(sessionId);
  if (session) {
    Object.assign(session, updates);
  }
  return session;
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

export function getAllSessions() {
  return Array.from(sessions.entries());
}
