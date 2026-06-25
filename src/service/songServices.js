import songs from "../data/songs.json" with { type: "json" };

export function getSongById(targetedId) {
  return songs.find((s) => s.id === targetedId);
}

export function searchSong(targetedText) {
  const targetLower = targetedText.toLowerCase();
  const results = songs.filter(
    (song) =>
      song.song_name.toLowerCase().includes(targetLower) ||
      song.artist_name.toLowerCase().includes(targetLower),
  );
  return results;
}

export function getAllSongs() {
  return songs;
}
