# LyricGuess — Decision Log

A running record of key product decisions and why, so we don't relitigate them
and so the reasoning survives handoffs. Newest at top.

| Date | Decision | Why | Status |
|------|----------|-----|--------|
| V1 scoping | Fixed 10-round sessions | Predictable length → higher completion, clean results moment, natural replay prompt | Locked |
| V1 scoping | No timer in V1 | Keeps build simple + loop low-pressure; timed mode is a roadmap experiment | Locked |
| V1 scoping | 2 modes (Song, Artist), not 3 | Enough to feel like a product; "Next Line" deferred to roadmap | Locked |
| V1 scoping | 5 genres | Variety without needing a huge dataset per genre | Locked |
| V1 scoping | Scoring 10/20/30 by difficulty, no multipliers | Transparent, trivial math for V1 | Locked |
| V1 scoping | Correct answer hidden until submission | Protects score integrity | Locked |
| V1 scoping | Anonymous ephemeral sessions | Zero-friction entry beats retention features at validation stage | Locked |
| Data | Lyrics.ovh + MusicBrainz, cached, short snippets only | Free/fair-use path to MVP without licensing a catalog | Locked (eng) |
| Open | Frontend framework | Needed for mock shell | Pending Garv |
| Open | Session model (stateful vs. token) | Backend architecture call | Pending Garv |
