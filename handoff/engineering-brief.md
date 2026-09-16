# LyricGuess — Engineering Brief

**From:** Samarth (PM / UX)
**To:** Garv (Engineering — Backend)
**Status:** V1 scope locked. Two items open pending engineering (see §12).

---

## 1. Product Goal

LyricGuess is a fast, mobile-first web game where a player reads a short lyric
snippet and guesses the song or artist from 4 choices. We're building a
lightweight, satisfying trivia loop that a college student can pick up for 2
minutes between classes. Success = players finish a full 10-round session and
tap "Play Again."

## 2. Target User

Primary: college students and younger music listeners who enjoy quick,
competitive trivia (think Wordle-style casual play, not a hardcore music app).
They play on their phone, in short bursts, and want zero setup — no account, no
tutorial.

## 3. Core Experience

Landing → pick genre → pick difficulty → pick mode → play 10 rounds → see
results → play again.

Each round: a lyric snippet appears with 4 answer choices. The player taps one,
gets immediate right/wrong feedback, and the score/streak/progress update.
After 10 rounds a results screen shows final score, accuracy, and best streak,
with a Play Again button that returns to genre selection.

The whole thing should feel snappy: no loading spinners between rounds if we can
help it, minimal text, big tap targets, satisfying feedback on answer.

## 4. MVP Requirements (must exist in V1)

- Genre selection (5 genres)
- Difficulty selection (3 tiers)
- Game mode selection (2 modes)
- A round that shows a lyric snippet + 4 answer choices
- Immediate correct/incorrect feedback
- Live score, streak, and round-progress display
- Fixed 10-round session
- Results screen (final score, accuracy %, best streak)
- Play Again

## 5. Out of Scope (do NOT build in V1)

- User accounts / login
- Leaderboards or social features
- Timer / speed bonus
- Streak multipliers
- "Guess the Next Line" or any third game mode
- Difficulty that changes UI (difficulty only changes song selection + snippet)
- Persistence across sessions (V1 session is anonymous and ephemeral)

## 6. Game Rules

**Genres (5):** Pop, Hip-Hop/Rap, R&B, Rock, Country. A genre must have enough
songs to fill a 10-round Hard session without repeats.

**Difficulty (3 tiers):** Defined by song popularity + snippet length, not by
harder UI.
- Easy — very famous songs, longer snippet
- Medium — moderately known songs
- Hard — deeper cuts, shorter/more ambiguous snippet

**Game modes (2):** Same snippet, different question.
- Guess the Song — 4 song titles as choices
- Guess the Artist — 4 artists as choices

**Answer choices:** Always 4 (1 correct, 3 distractors). Distractors should be
plausible (same genre; ideally similar era/popularity).

**Score:** Easy = 10, Medium = 20, Hard = 30 per correct answer. No points for
wrong answers. No timer.

**Streak:** Starts at 0. +1 per correct answer, resets to 0 on any wrong answer.
Track the highest streak reached during the session ("best streak").

**Session:** Exactly 10 rounds. Same genre/difficulty/mode for the whole
session (chosen at the start). No repeated songs within a session.

**End state:** After round 10, show results: final score, accuracy %
(correct ÷ 10), best streak. Play Again returns to genre selection.

## 7. Required Backend Capabilities

The frontend needs the backend to:
1. Start a session given genre + difficulty + mode, and return the first
   question (or a session ID to fetch questions against).
2. Serve one question at a time: a lyric snippet + 4 answer choices, with no
   repeats inside a session.
3. Validate a submitted answer and return whether it was correct (frontend
   should NOT know the correct answer before submission — don't ship it in the
   question payload, or scoring can be cheated).
4. Track/return session progress and final results.

How you architect this (stateful server sessions vs. stateless with a session
token, DB vs. flat file) is your call — see Open Questions.

## 8. Data Needed by the Frontend

Shapes below are the contract the mock frontend will code against. Field names
are a proposal — adjust as needed, just tell me so the mock stays in sync.

**Start a game — request**
{ genre: string, difficulty: "easy" | "medium" | "hard", mode: "song" | "artist" }
**Start a game — response**
{ sessionId: string, totalRounds: 10, currentRound: 1, question: <Question> }

**Question object**
{
questionId: string,
round: number,
snippet: string,
choices: [ { choiceId: string, label: string }, x4 ]
}
(No `correct` field in this payload — see §7.3.)

**Submit an answer — request**
{ sessionId: string, questionId: string, choiceId: string }
**Submit an answer — response**
{
correct: boolean,
correctChoiceId: string,
score: number, // running total
streak: number, // current
bestStreak: number,
currentRound: number,
isComplete: boolean,
nextQuestion: <Question> | null // null when isComplete
}

**Session results (when isComplete, or via a results fetch)**
{
sessionId: string,
finalScore: number,
correctCount: number,
totalRounds: 10,
accuracy: number, // 0.0–1.0
bestStreak: number
}

## 9. Error / Edge States

- **Failed question load** — show a short "Couldn't load that one" message with a
  Retry button. Don't crash the session.
- **Insufficient songs** (a genre/difficulty can't fill 10 unique rounds) —
  backend should surface this at session start so the frontend can show
  "Not enough songs for this combo yet — try another" before play begins,
  rather than failing mid-session.
- **Connection failure** — non-blocking banner + Retry; preserve current session
  state so the player doesn't lose progress.
- **Invalid answer** (choiceId not in the question) — reject server-side, return
  a clear error; frontend just re-enables the choices.
- **Duplicate submission** (same question answered twice, e.g. double-tap) —
  backend treats the first as authoritative and ignores/returns the same
  result for the second. Frontend should also disable choices after first tap.
- **Session expiration / unknown sessionId** — return a clear "session expired"
  signal; frontend shows "This session ended — start a new game."

## 10. Analytics Requirements

Track these events (name = event, with listed properties):
- `session_start` — genre, difficulty, mode
- `question_shown` — round, difficulty
- `answer_submitted` — correct (bool), round, streak
- `session_complete` — finalScore, accuracy, bestStreak
- `play_again_clicked`
- `error_shown` — errorType

Goal is to answer: do people finish sessions? which genres/difficulties are
popular? what's the accuracy curve? do they replay?

## 11. Acceptance Criteria (MVP is "done" when…)

- A player can select genre, difficulty, and mode and start a session.
- 10 rounds play in sequence with no repeated songs.
- Each round shows a snippet + exactly 4 choices; correct answer is not
  exposed before submission.
- Answering gives immediate correct/incorrect feedback.
- Score, streak, and round progress update correctly per the rules in §6.
- Results screen shows correct final score, accuracy %, and best streak.
- Play Again returns to genre selection and a fresh session works.
- The listed error states are handled without crashing.
- Analytics events in §10 fire.

## 12. Open Questions (for engineering to decide)

- **Data source for songs/snippets.** Lyrics are copyrighted and most lyrics
  APIs have licensing limits. Leading option for MVP: a hand-built JSON dataset
  (~10+ songs per genre per difficulty, with short snippets + 3 distractors
  each). Confirm approach and who curates the data.
- **Tech stack.** Frontend framework, backend language/framework, and hosting —
  your call. Tell me the frontend framework so the mock shell matches it.
- **Session model.** Stateful server sessions vs. stateless session token — your
  call; just confirm so the API contract in §8 is right.
- **Distractor generation.** Hand-authored per song, or generated from the genre
  pool? Affects data authoring effort.

---

## Engineering: Start Here

Do NOT build the whole app at once. Build one vertical slice — a single playable
round end to end — then expand. Suggested first tasks:

1. **Lock the data shape + seed a tiny dataset.** Create the song/question data
   structure and hand-author ~5 songs for ONE genre at ONE difficulty (enough
   to test a few rounds). This unblocks everything else.
2. **Build "start session" + "get question."** Return one Question object
   (snippet + 4 choices, no correct answer exposed) for the seeded genre.
3. **Build "submit answer."** Validate the choice, return correct/incorrect +
   updated score and streak per §6.
4. **Wire one full round to the frontend mock** so we can see snippet → tap →
   feedback → next question working against a real (if tiny) backend.
5. **Extend to a full 10-round session + results** once the single round is
   solid.

Once the vertical slice works, we scale the dataset and add the remaining
genres/difficulties/modes.
