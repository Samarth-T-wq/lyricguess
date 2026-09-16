# LyricGuess — UX Notes

Rationale and detail behind the flows. The "why" for engineering and future me.

## Setup should be 3 taps, max
Genre → difficulty → mode = three taps to first round. That's the friction
budget. If it ever grows, cut it. Consider a smart default on difficulty (Easy)
so a player could reach a round even faster (test in experiment E4).

## The round screen is the product
Everything else is scaffolding. The round screen should be dead simple:
- Snippet is the hero — big, readable, centered.
- 4 large choice buttons below it.
- Score / streak / progress compact at the top, never competing with the snippet.
- Nothing else. No clutter.

## Feedback is the emotional core
When a player taps:
- Instantly lock the choices (prevents double-tap; see brief §9).
- Show correct/incorrect clearly — color + the correct answer highlighted.
- Update score and streak visibly (a little animation on streak increase pulls
  "one more round").
- Move to the next round quickly, but not so fast the feedback doesn't register
  (~1s beat).

## Streak deserves visual weight
Streak is the main "don't stop" hook. Make it feel alive — grows/animates on
each correct, visibly resets on a wrong answer. This is cheap to build and does
a lot of motivational work.

## Results screen is the shareable moment
Final score, accuracy, best streak, big and proud. Play Again is the primary
action. This is the screen someone screenshots — design it to look good as a
screenshot (roadmap: actual share button).

## Error states should never dead-end
Every error (failed load, connection drop, expired session) offers a way
forward — Retry or Start New Game. Never leave the player staring at a broken
screen. Keep error copy short and human, not technical.

## Copy tone
Minimal, casual, a little playful. "Nice streak!" not "Correct answer recorded."
No instructional walls of text — the game should be obvious by doing.
