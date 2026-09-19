import { getSongPool } from "./songData.js";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildQuestion(sessionId, roundIdx, song, genre, difficulty, mode) {
  const pool = getSongPool(genre, difficulty);

  // Pick 3 distractors from the pool (excluding the correct song)
  const candidates = pool.filter((s) => s.song !== song.song);
  const distractors = shuffle(candidates).slice(0, 3).map((s) =>
    mode === "song" ? s.song : s.artist
  );

  const correct = mode === "song" ? song.song : song.artist;
  const choices = shuffle([correct, ...distractors]).map((label) => ({
    choiceId: label,
    label
  }));

  return {
    questionId: `${sessionId}_q${roundIdx}`,
    round: roundIdx + 1,
    snippet: song.snippet,
    choices
  };
}
