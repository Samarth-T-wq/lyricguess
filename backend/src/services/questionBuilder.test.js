import { test } from "node:test";
import assert from "node:assert";
import { buildQuestion } from "./questionBuilder.js";

test("buildQuestion creates a valid question", () => {
  const song = { song: "Test Song", artist: "Test Artist", snippet: "Test lyric" };
  const q = buildQuestion("sess_123", 0, song, "pop", "easy", "song");

  assert.strictEqual(q.round, 1);
  assert.strictEqual(q.snippet, "Test lyric");
  assert.strictEqual(q.choices.length, 4);
  assert.ok(q.choices.some((c) => c.choiceId === "Test Song"));
});

test("buildQuestion correct answer not always first", () => {
  const song = { song: "Unique Song", artist: "Unique Artist", snippet: "Snippet" };
  const questions = Array(10)
    .fill()
    .map((_, i) =>
      buildQuestion("sess_123", i, song, "pop", "easy", "song")
    );

  const firstPositions = questions.map((q) =>
    q.choices.findIndex((c) => c.choiceId === "Unique Song")
  );

  assert.ok(firstPositions.some((p) => p !== 0), "Correct answer should vary position");
});

test("buildQuestion in artist mode", () => {
  const song = { song: "Test Song", artist: "Test Artist", snippet: "Test lyric" };
  const q = buildQuestion("sess_123", 0, song, "pop", "easy", "artist");

  assert.ok(q.choices.some((c) => c.choiceId === "Test Artist"));
  assert.ok(!q.choices.some((c) => c.choiceId === "Test Song"));
});
