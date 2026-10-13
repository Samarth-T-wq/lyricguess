import { test } from "node:test";
import assert from "node:assert";
import { streakMultiplier, pointsFor } from "./scoring.js";

test("streakMultiplier tiers", () => {
  assert.deepStrictEqual([0, 1, 2].map(streakMultiplier), [1, 1, 1]);
  assert.deepStrictEqual([3, 4].map(streakMultiplier), [1.5, 1.5]);
  assert.deepStrictEqual([5, 6, 7].map(streakMultiplier), [2, 2, 2]);
  assert.deepStrictEqual([8, 9, 50].map(streakMultiplier), [3, 3, 3]);
});

test("pointsFor applies multiplier to base points", () => {
  assert.strictEqual(pointsFor("easy", 0), 10);
  assert.strictEqual(pointsFor("easy", 3), 15);
  assert.strictEqual(pointsFor("medium", 5), 40);
  assert.strictEqual(pointsFor("hard", 8), 90);
});
