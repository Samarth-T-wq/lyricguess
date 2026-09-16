# LyricGuess — User Journeys

## Happy path (first session)
1. Lands on the page → sees a clear "Play" entry, no signup.
2. Picks a genre (one tap).
3. Picks difficulty (one tap).
4. Picks mode (one tap).
5. Round 1 loads: lyric snippet + 4 choices.
6. Taps an answer → immediate right/wrong feedback → score/streak update.
7. Next round loads fast. Repeats for 10 rounds.
8. Results screen: final score, accuracy %, best streak.
9. Taps Play Again → back to genre selection.

Emotional arc we're designing for: curious → engaged → "one more round" → proud
of the score → replays or shares.

## Edge journeys
- **Not enough songs for a combo:** told before play starts, nudged to pick a
  different genre/difficulty (brief §9). Never fails mid-session.
- **A question won't load:** short message + Retry, session preserved.
- **Connection drops:** non-blocking banner, progress kept, Retry.
- **Session expires:** clear "start a new game" message, no dead-end.

## Drop-off risks to watch
- Too many setup taps before the first round → friction. (We keep it to 3.)
- Slow load between rounds → breaks the snappy feel. (Prefetch next question.)
- Feedback that isn't satisfying → weak "play again" pull. (Design invests here.)
