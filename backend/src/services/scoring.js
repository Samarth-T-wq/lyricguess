export const POINTS = { easy: 10, medium: 20, hard: 30 };

// Multiplier for the streak a player is riding into an answer.
// The same value is shown in the UI as the "active" multiplier, so what the
// player sees is exactly what their next correct answer earns.
export function streakMultiplier(streak) {
  if (streak >= 8) return 3;
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

export function pointsFor(difficulty, streak) {
  return Math.round(POINTS[difficulty] * streakMultiplier(streak));
}
