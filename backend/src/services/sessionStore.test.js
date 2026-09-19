import { test } from "node:test";
import assert from "node:assert";
import { createSession, getSession, updateSession, deleteSession } from "./sessionStore.js";

test("createSession returns sessionId", () => {
  const result = createSession("pop", "easy", "song");
  assert.ok(result.sessionId);
  assert.ok(result.sessionId.startsWith("sess_"));
  assert.strictEqual(result.session.genre, "pop");
  assert.strictEqual(result.session.round, 0);
  assert.strictEqual(result.session.score, 0);
});

test("createSession with insufficient songs", () => {
  const result = createSession("pop", "hard", "song");
  assert.strictEqual(result.error, "INSUFFICIENT_SONGS");
});

test("getSession retrieves created session", () => {
  const { sessionId, session: created } = createSession("pop", "easy", "song");
  const retrieved = getSession(sessionId);

  assert.strictEqual(retrieved.genre, created.genre);
  assert.strictEqual(retrieved.difficulty, created.difficulty);
  deleteSession(sessionId);
});

test("updateSession modifies session state", () => {
  const { sessionId } = createSession("pop", "easy", "song");
  updateSession(sessionId, { score: 30, streak: 2 });
  const updated = getSession(sessionId);

  assert.strictEqual(updated.score, 30);
  assert.strictEqual(updated.streak, 2);
  deleteSession(sessionId);
});

test("session order has no repeats", () => {
  const { session } = createSession("pop", "easy", "song");
  const songs = session.order.map((s) => s.song);
  const unique = new Set(songs);

  assert.strictEqual(songs.length, unique.size, "No repeated songs");
});
