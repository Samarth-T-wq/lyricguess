import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fetchLyrics } from "../src/clients/lyricsOvh.js";
import { lookupArtist } from "../src/clients/musicbrainz.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_PATH = path.join(__dirname, "../data/seed-songs.json");
const CACHE_PATH = path.join(__dirname, "../data/cache/songs.json");

function extractSnippet(lyrics, difficulty) {
  const lines = lyrics.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return null;

  // Skip the first line (often the hook/title) and grab from the middle
  const startIdx = Math.max(1, Math.floor(lines.length * 0.3));
  const endIdx = startIdx + (difficulty === "easy" ? 2 : 1);
  const snippetLines = lines.slice(startIdx, Math.min(endIdx, lines.length));

  return snippetLines.join(" ").trim();
}

async function buildCache() {
  console.log("📝 Building song cache...");

  const seedData = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
  const cache = {};
  let success = 0;
  let failed = 0;

  for (const song of seedData) {
    const { genre, difficulty, artist, title, snippetOverride } = song;

    // Initialize genre/difficulty if needed
    if (!cache[genre]) cache[genre] = {};
    if (!cache[genre][difficulty]) cache[genre][difficulty] = [];

    // Use override or fetch from API
    let snippet = snippetOverride || null;

    if (!snippet) {
      console.log(`  Fetching: ${artist} - ${title}`);
      const lyrics = await fetchLyrics(artist, title);
      if (lyrics) {
        snippet = extractSnippet(lyrics, difficulty);
      }
    }

    if (snippet) {
      cache[genre][difficulty].push({
        song: title,
        artist,
        snippet
      });
      success++;
    } else {
      console.warn(`  ❌ Failed: ${artist} - ${title}`);
      failed++;
    }
  }

  // Write cache
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));

  console.log(`\n✅ Cache built: ${success} songs, ${failed} failed`);
  console.log(`📁 Written to ${CACHE_PATH}`);
}

buildCache().catch((err) => {
  console.error("Error building cache:", err);
  process.exit(1);
});
