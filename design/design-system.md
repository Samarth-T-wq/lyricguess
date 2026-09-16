# LyricGuess — Design System

Lightweight system for a mobile-first, low-friction game. Not a full brand
system — just enough shared language for the frontend to feel consistent and
intentional. Don't overbuild this.

## Design principles
1. **Mobile-first.** Design for a phone in one hand, thumb reach. Desktop is a
   scaled-up version, not a separate design.
2. **Low friction.** Every screen has one obvious next action. Minimal text.
3. **Fast rounds.** No unnecessary transitions or loading between rounds.
4. **Satisfying feedback.** Correct/incorrect should feel good and be instant.
5. **Big tap targets.** Answer choices are large, easy to hit without looking.

## Layout
- Single column, centered, max content width ~480px (phone-sized even on desktop).
- Generous vertical spacing; one primary focus per screen.
- Answer choices: full-width stacked buttons, large tap area (min ~56px tall).

## Color (semantic, not literal — engineering picks final hex)
- **Background:** dark or deep-tinted, modern consumer feel.
- **Primary/accent:** one bold color for primary actions and highlights.
- **Correct:** green. **Incorrect:** red. Used only for answer feedback.
- **Neutral:** muted tones for secondary text and inactive states.
- Keep the palette small: background, accent, correct, incorrect, 2 neutrals.

## Typography
- One clean sans-serif family.
- Big, confident sizes for the lyric snippet and score — this is a game, not a
  document.
- Snippet is the visual hero of the round screen.

## Core components
- **Choice button** — large, full-width; default / selected / correct / incorrect
  states.
- **Score + streak display** — always visible during play, compact, top of screen.
- **Progress indicator** — "Round X of 10" or a simple progress bar.
- **Primary button** — Play, Play Again, Retry.
- **Selector chips** — genre / difficulty / mode options (tappable, one-tap select).
- **Feedback moment** — the visual/animation on answer (the emotional payoff).

## Motion
- Subtle and fast. Answer feedback animates in under ~300ms.
- Next round appears immediately; avoid spinners between rounds (prefetch).
- Save any bigger celebratory animation for the results screen.
