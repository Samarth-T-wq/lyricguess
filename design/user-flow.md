# LyricGuess — User Flow

## Screens
1. **Landing** — title + Play. Zero friction, no signup.
2. **Genre select** — 5 tappable options.
3. **Difficulty select** — Easy / Medium / Hard.
4. **Mode select** — Guess the Song / Guess the Artist.
5. **Round** — snippet + 4 choices + score/streak/progress. (Repeats ×10.)
6. **Answer feedback** — inline on the round screen: correct/incorrect, score +
   streak update, then next round.
7. **Results** — final score, accuracy %, best streak, Play Again.

## Flow diagram
```mermaid
flowchart TD
    A[Landing] --> B[Genre select]
    B --> C[Difficulty select]
    C --> D[Mode select]
    D --> E[Round: snippet + 4 choices]
    E --> F[Tap answer]
    F --> G[Feedback: correct/incorrect + score/streak update]
    G -->|rounds left| E
    G -->|round 10 done| H[Results: score, accuracy, best streak]
    H -->|Play Again| B
```

## Edge branches
- **Insufficient songs for combo** — caught after mode select, before Round 1:
  message + nudge back to genre/difficulty. Never enters a broken session.
- **Question won't load** — inline on Round: short message + Retry.
- **Connection drops** — non-blocking banner + Retry; session state preserved.
- **Session expired** — message + Start New Game (back to Landing/Genre).

## Flow principles
- Setup is a straight line: Landing → Genre → Difficulty → Mode → Round. No
  branching, no back-tracking required to play.
- Play Again loops back to Genre select (not Landing) — one fewer tap to replay,
  supports the replay-rate goal.
- Every error branch rejoins the main flow or offers a clean restart.
