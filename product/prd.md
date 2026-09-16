# LyricGuess — Product Requirements (V1)

This PRD is the detailed companion to `/handoff/engineering-brief.md`. Where the
brief is the engineering handoff, this is the product source of truth. On any
conflict, the brief's game rules (§6) win.

## Goal
Ship a playable, mobile-first single-session lyric guessing game that validates
the core loop: pick a game → play 10 rounds → see results → play again.

## In scope (V1)
- Genre selection: Pop, Hip-Hop/Rap, R&B, Rock, Country
- Difficulty: Easy / Medium / Hard (drives song popularity + snippet length)
- Modes: Guess the Song, Guess the Artist
- 10-round session, 4 answer choices per round
- Immediate feedback, live score + streak + progress
- Results screen: final score, accuracy %, best streak
- Play Again
- Error/edge handling per brief §9
- Analytics events per brief §10

## Out of scope (V1)
Accounts, leaderboards, timers, streak multipliers, a third mode, cross-session
persistence. (See brief §5.)

## Scoring & rules
Per brief §6: Easy 10 / Medium 20 / Hard 30 per correct answer; streak +1 on
correct, resets to 0 on wrong; best streak tracked; no repeated songs in a
session.

## Key product decisions
- **Fixed 10 rounds**, not endless. Predictable length = higher completion, a
  clean results moment, and a natural replay prompt.
- **No timer in V1.** Keeps the build simple and the loop low-pressure; timed
  mode is a roadmap experiment, not a launch feature.
- **Correct answer hidden until submission.** Integrity of the score (brief §7).
- **Anonymous, ephemeral sessions.** Zero-friction entry beats retention
  features at the validation stage.

## Dependencies
- Backend contract per brief §7–§8
- Data pipeline (Lyrics.ovh + MusicBrainz → cache → questions) per brief §11a
- Frontend framework: TBD pending engineering (brief §12)

## Success criteria
Acceptance criteria per brief §11. Product-level success metrics in `metrics.md`.
