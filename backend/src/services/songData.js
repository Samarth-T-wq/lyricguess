import fs from "fs";
import path from "path";

let songCache = null;

export function loadSongs() {
  if (songCache) return songCache;

  const cacheFile = path.join(import.meta.url, "../../data/cache/songs.json").replace("file://", "");

  try {
    const data = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
    songCache = data;
    return data;
  } catch (err) {
    console.error("Failed to load song cache:", err.message);
    return {};
  }
}

export function getSongPool(genre, difficulty) {
  const songs = loadSongs();
  return songs[genre]?.[difficulty] || [];
}

export function hasEnoughSongs(genre, difficulty, needed = 10) {
  const pool = getSongPool(genre, difficulty);
  return pool.length >= needed;
}
