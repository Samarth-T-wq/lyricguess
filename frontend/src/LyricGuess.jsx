import React, { useState, useRef } from "react";

const GENRES = [
  { id: "pop", label: "Pop" },
  { id: "hiphop", label: "Hip-Hop / Rap" },
  { id: "rnb", label: "R&B" },
  { id: "rock", label: "Rock" },
  { id: "country", label: "Country" },
];
const DIFFICULTIES = [
  { id: "easy", label: "Easy", sub: "Big hits" },
  { id: "medium", label: "Medium", sub: "You'd know these" },
  { id: "hard", label: "Hard", sub: "Deep cuts" },
];
const MODES = [
  { id: "song", label: "Guess the Song" },
  { id: "artist", label: "Guess the Artist" },
];

const API_BASE = import.meta.env.VITE_API_URL || "";

const api = {
  async startGame({ genre, difficulty, mode }) {
    const res = await fetch(`${API_BASE}/api/session/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ genre, difficulty, mode }),
    });
    return res.json();
  },

  async submitAnswer({ sessionId, questionId, choiceId }) {
    const res = await fetch(`${API_BASE}/api/session/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, questionId, choiceId }),
    });
    return res.json();
  },
};

// ---- ANALYTICS (mock — brief §10) ------------------------------------------
function track(event, props = {}) {
  // Real version: send to analytics. Here we just log so events are visible.
  // eslint-disable-next-line no-console
  console.log("[analytics]", event, props);
}

// ---- UI --------------------------------------------------------------------
const C = {
  bg: "#0e0a1f", card: "#1b1435", ink: "#f5f2ff", sub: "#a99fd6",
  accent: "#ff5d8f", accent2: "#7c5cff", good: "#3ddc97", bad: "#ff5b5b",
  line: "#2e2552",
};

export default function LyricGuess() {
  const [screen, setScreen] = useState("landing"); // landing|genre|difficulty|mode|round|results|error
  const [genre, setGenre] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [mode, setMode] = useState(null);

  const [session, setSession] = useState(null);
  const [question, setQuestion] = useState(null);
  const [scoreState, setScoreState] = useState({ score: 0, streak: 0, bestStreak: 0, multiplier: 1, round: 1 });
  const [picked, setPicked] = useState(null);
  const [reveal, setReveal] = useState(null); // { correct, correctChoiceId, pointsAwarded }
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [results, setResults] = useState(null);
  const lockRef = useRef(false);

  function reset() {
    setGenre(null); setDifficulty(null); setMode(null);
    setSession(null); setQuestion(null); setPicked(null); setReveal(null);
    setResults(null); setScoreState({ score: 0, streak: 0, bestStreak: 0, multiplier: 1, round: 1 });
  }

  async function begin(g, d, m) {
    setLoading(true);
    track("session_start", { genre: g, difficulty: d, mode: m });
    const res = await api.startGame({ genre: g, difficulty: d, mode: m });
    setLoading(false);
    if (res.error === "INSUFFICIENT_SONGS") {
      setErrorMsg("Not enough songs for that combo yet. Try another genre or difficulty.");
      setScreen("error");
      return;
    }
    setSession({ id: res.sessionId, total: res.totalRounds });
    setQuestion(res.question);
    setScoreState({ score: 0, streak: 0, bestStreak: 0, multiplier: res.multiplier ?? 1, round: 1 });
    setScreen("round");
    track("question_shown", { round: 1, difficulty: d });
  }

  async function answer(choiceId) {
    if (lockRef.current) return;          // duplicate-submission guard (UI side)
    lockRef.current = true;
    setPicked(choiceId);
    const res = await api.submitAnswer({ sessionId: session.id, questionId: question.questionId, choiceId });
    if (res.error === "SESSION_EXPIRED") {
      setErrorMsg("This session ended. Start a new game.");
      setScreen("error"); lockRef.current = false; return;
    }
    track("answer_submitted", { correct: res.correct, round: scoreState.round, streak: res.streak });
    setReveal({ correct: res.correct, correctChoiceId: res.correctChoiceId, pointsAwarded: res.pointsAwarded });
    setScoreState((s) => ({ ...s, score: res.score, streak: res.streak, bestStreak: res.bestStreak, multiplier: res.multiplier ?? 1 }));

    setTimeout(() => {
      if (res.isComplete) {
        setResults(res.results);
        track("session_complete", { finalScore: res.results.finalScore, accuracy: res.results.accuracy, bestStreak: res.results.bestStreak });
        setScreen("results");
      } else {
        setQuestion(res.nextQuestion);
        setPicked(null); setReveal(null);
        setScoreState((s) => ({ ...s, round: res.currentRound }));
        track("question_shown", { round: res.currentRound, difficulty });
      }
      lockRef.current = false;
    }, 1100);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "'Space Grotesk', system-ui, sans-serif", display: "flex", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes pop { 0%{transform:scale(.9);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes streakpulse { 0%{transform:scale(1)} 40%{transform:scale(1.35)} 100%{transform:scale(1)} }
        button:focus-visible { outline: 3px solid ${C.accent2}; outline-offset: 2px; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480, padding: "20px 18px 40px", display: "flex", flexDirection: "column" }}>
        {screen === "landing" && <Landing onPlay={() => setScreen("genre")} />}

        {screen === "genre" && (
          <Picker title="Pick a genre" options={GENRES}
            onPick={(id) => { setGenre(id); setScreen("difficulty"); }} />
        )}
        {screen === "difficulty" && (
          <Picker title="How hard?" options={DIFFICULTIES}
            onPick={(id) => { setDifficulty(id); setScreen("mode"); }} back={() => setScreen("genre")} />
        )}
        {screen === "mode" && (
          <Picker title="Choose a mode" options={MODES} loading={loading}
            onPick={(id) => { setMode(id); begin(genre, difficulty, id); }} back={() => setScreen("difficulty")} />
        )}

        {screen === "round" && question && (
          <Round question={question} total={session.total} scoreState={scoreState}
            picked={picked} reveal={reveal} onAnswer={answer} />
        )}

        {screen === "results" && results && (
          <Results results={results} onPlayAgain={() => { track("play_again_clicked"); reset(); setScreen("genre"); }} />
        )}

        {screen === "error" && (
          <ErrorState msg={errorMsg} onBack={() => { reset(); setScreen("genre"); }} />
        )}
      </div>
    </div>
  );
}

function Landing({ onPlay }) {
  return (
    <div style={{ marginTop: "22vh", textAlign: "center", animation: "pop .4s ease" }}>
      <div style={{ fontSize: 15, letterSpacing: 2, color: C.accent, fontWeight: 500 }}>♪ ♪ ♪</div>
      <h1 style={{ fontSize: 52, lineHeight: 1, margin: "14px 0 8px", fontWeight: 700 }}>
        Lyric<span style={{ color: C.accent }}>Guess</span>
      </h1>
      <p style={{ color: C.sub, fontSize: 17, margin: "0 0 40px" }}>Read the line. Name the track.</p>
      <BigButton onClick={onPlay}>Play</BigButton>
    </div>
  );
}

function Picker({ title, options, onPick, back, loading }) {
  return (
    <div style={{ marginTop: "8vh", animation: "pop .3s ease" }}>
      {back && <BackLink onClick={back} />}
      <h2 style={{ fontSize: 30, fontWeight: 700, margin: "8px 0 24px" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {options.map((o) => (
          <button key={o.id} onClick={() => !loading && onPick(o.id)} disabled={loading}
            style={{ ...choiceStyle, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: loading ? 0.5 : 1 }}>
            <span style={{ fontSize: 19, fontWeight: 500 }}>{o.label}</span>
            {o.sub && <span style={{ color: C.sub, fontSize: 14 }}>{o.sub}</span>}
          </button>
        ))}
      </div>
      {loading && <p style={{ color: C.sub, textAlign: "center", marginTop: 20 }}>Starting game…</p>}
    </div>
  );
}

function Round({ question, total, scoreState, picked, reveal, onAnswer }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <span style={{ color: C.sub, fontSize: 14, fontWeight: 500 }}>Round {scoreState.round} / {total}</span>
        <div style={{ display: "flex", gap: 16 }}>
          <Stat label="Score" value={scoreState.score}
            gain={reveal?.correct && reveal.pointsAwarded > 0 ? reveal.pointsAwarded : null} />
          <Stat label="Streak" value={scoreState.streak} flame streak={scoreState.streak}
            multiplier={scoreState.multiplier} />
        </div>
      </div>

      <ProgressBar current={scoreState.round} total={total} />

      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 20, padding: "34px 24px", margin: "20px 0 24px", minHeight: 150, display: "flex", alignItems: "center", justifyContent: "center", animation: "pop .3s ease" }}>
        <p style={{ fontSize: 24, lineHeight: 1.35, fontWeight: 500, textAlign: "center", margin: 0 }}>
          "{question.snippet}"
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {question.choices.map((c) => {
          let bg = C.card, border = C.line, ink = C.ink;
          if (reveal) {
            if (c.choiceId === reveal.correctChoiceId) { bg = "rgba(61,220,151,.15)"; border = C.good; ink = C.good; }
            else if (c.choiceId === picked) { bg = "rgba(255,91,91,.13)"; border = C.bad; ink = C.bad; }
          } else if (picked === c.choiceId) { border = C.accent2; }
          return (
            <button key={c.choiceId} onClick={() => onAnswer(c.choiceId)} disabled={!!picked}
              style={{ ...choiceStyle, background: bg, borderColor: border, color: ink,
                fontSize: 18, fontWeight: 500, cursor: picked ? "default" : "pointer" }}>
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Results({ results, onPlayAgain }) {
  const pct = Math.round(results.accuracy * 100);
  return (
    <div style={{ marginTop: "10vh", textAlign: "center", animation: "pop .4s ease" }}>
      <p style={{ color: C.accent, fontWeight: 500, fontSize: 15, letterSpacing: 1 }}>SESSION COMPLETE</p>
      <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1, margin: "10px 0" }}>{results.finalScore}</div>
      <p style={{ color: C.sub, margin: "0 0 34px" }}>points</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
        <ResultCard label="Accuracy" value={`${pct}%`} />
        <ResultCard label="Correct" value={`${results.correctCount}/${results.totalRounds}`} />
        <ResultCard label="Best streak" value={results.bestStreak} />
      </div>
      <BigButton onClick={onPlayAgain}>Play again</BigButton>
    </div>
  );
}

function ErrorState({ msg, onBack }) {
  return (
    <div style={{ marginTop: "18vh", textAlign: "center", animation: "pop .3s ease" }}>
      <div style={{ fontSize: 40, marginBottom: 14 }}>🎧</div>
      <p style={{ fontSize: 20, fontWeight: 500, margin: "0 0 28px", lineHeight: 1.4 }}>{msg}</p>
      <BigButton onClick={onBack}>Back to genres</BigButton>
    </div>
  );
}

// ---- small components ------------------------------------------------------
function Stat({ label, value, flame, streak, multiplier, gain }) {
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 11, color: C.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
        {gain != null && (
          <span style={{ fontSize: 13, fontWeight: 700, color: C.good, animation: "pop .3s ease" }}>+{gain}</span>
        )}
        <div key={value} style={{ fontSize: 20, fontWeight: 700, animation: flame && streak > 0 ? "streakpulse .4s ease" : "none" }}>
          {flame && streak > 0 ? `🔥${value}` : value}
        </div>
        {multiplier > 1 && <MultiplierBadge value={multiplier} />}
      </div>
    </div>
  );
}
function MultiplierBadge({ value }) {
  return (
    <span key={value} title="Points multiplier for your next correct answer"
      style={{ fontSize: 12, fontWeight: 700, color: "#fff", padding: "2px 7px", borderRadius: 99,
        background: `linear-gradient(90deg, ${C.accent2}, ${C.accent})`, animation: "streakpulse .4s ease" }}>
      x{value}
    </span>
  );
}
function ProgressBar({ current, total }) {
  return (
    <div style={{ height: 6, background: C.line, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(current / total) * 100}%`, background: `linear-gradient(90deg, ${C.accent2}, ${C.accent})`, borderRadius: 99, transition: "width .4s ease" }} />
    </div>
  );
}
function ResultCard({ label, value }) {
  return (
    <div style={{ flex: 1, background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 8px" }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>{label}</div>
    </div>
  );
}
function BigButton({ children, onClick }) {
  return (
    <button onClick={onClick}
      style={{ width: "100%", padding: "18px", fontSize: 19, fontWeight: 700, color: "#fff", border: "none", borderRadius: 16,
        background: `linear-gradient(90deg, ${C.accent2}, ${C.accent})`, cursor: "pointer", fontFamily: "inherit" }}>
      {children}
    </button>
  );
}
function BackLink({ onClick }) {
  return <button onClick={onClick} style={{ background: "none", border: "none", color: C.sub, fontSize: 15, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>← Back</button>;
}
const choiceStyle = {
  width: "100%", padding: "17px 18px", borderRadius: 14, border: `1px solid ${C.line}`,
  background: C.card, color: C.ink, fontFamily: "inherit", cursor: "pointer",
  transition: "border-color .15s ease, background .15s ease",
};
