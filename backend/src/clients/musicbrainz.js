let lastRequestTime = 0;
const MIN_DELAY_MS = 1000; // 1 req/sec throttle

async function throttle() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_DELAY_MS) {
    await new Promise((r) => setTimeout(r, MIN_DELAY_MS - elapsed));
  }
  lastRequestTime = Date.now();
}

export async function lookupArtist(artistName) {
  await throttle();
  const encodedName = encodeURIComponent(artistName);
  const url = `https://musicbrainz.org/ws/2/artist?query=name:"${encodedName}"&limit=1&fmt=json`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "LyricGuess/1.0 (https://github.com/user/lyricguess)"
      }
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (data.artists && data.artists.length > 0) {
      return data.artists[0].name;
    }
    return null;
  } catch (err) {
    console.error(`Error looking up artist ${artistName}:`, err.message);
    return null;
  }
}
