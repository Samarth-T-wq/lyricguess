export async function fetchLyrics(artist, title) {
  const encodedArtist = encodeURIComponent(artist);
  const encodedTitle = encodeURIComponent(title);
  const url = `https://api.lyrics.ovh/v1/${encodedArtist}/${encodedTitle}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.lyrics || null;
  } catch (err) {
    console.error(`Error fetching lyrics for ${artist} - ${title}:`, err.message);
    return null;
  }
}
