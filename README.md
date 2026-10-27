# LyricGuess

A web-based music trivia game where players guess the song from its lyrics. Built to get people playing together in person, cut down on social media time, and help them find new music.

**Live demo:** https://lyricguess.vercel.app

## Features

- 5 genres and 3 difficulty tiers
- 2 game modes
- Streak multiplier that rewards consecutive correct guesses
- Song submissions: players can suggest a song and artist for future rounds
- Mobile-first design, built for playing on phones in a group

## Results

After launch, I collected feedback from 8 users and shipped V2 based on it:

- Games per session rose from 2.1 to 3.4
- 5 of 8 testers submitted a song

## Tech Stack

- **Frontend:** React, deployed on Vercel
- **Backend:** Node.js, Express, deployed on Railway
- **Lyrics data:** Lyrics.ovh API
- **Design:** Figma (7-screen mobile flow, landing to results)

## My Role

I was the product manager and UX designer, and I built the V2 features.

- Defined the MVP scope and product strategy
- Designed the game mechanics across genres, difficulty tiers, and modes
- Wrote a 12-section engineering brief and 12 supporting product and UX docs
- Designed the mobile-first user flow in Figma and built the React prototype
- Ran user feedback and used it to prioritize V2

Backend and API development: Garv ([GitHub link])

## Running Locally

```bash
git clone https://github.com/[your-username]/lyricguess.git
cd lyricguess
```

Frontend:

```bash
cd client
npm install
npm start
```

Backend:

```bash
cd server
npm install
npm start
```

Create a `.env` file in `server/` with any required variables (see `.env.example`).

## Screenshots

![Landing](./docs/landing.png)
![Gameplay](./docs/gameplay.png)
![Results](./docs/results.png)

## Design and Product Docs

- Figma: [link]
- Engineering brief: [link]

## Future Work

- More genres and a larger song library
- Multiplayer rooms for playing across devices
- Leaderboards# lyricguess
