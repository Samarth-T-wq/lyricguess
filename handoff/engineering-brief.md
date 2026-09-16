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
