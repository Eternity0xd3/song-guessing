import songs from "../data/songs.json" with { type: "json" };

function hashing(str) {
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) & 0xffffffff;
  }

  // multiple hashing: to magnify the difference
  let hash = BigInt(seed);
  hash = (BigInt(hash) ^ (BigInt(hash) << 13n)) & 0xffffffffn;
  hash = (hash * 9301n + 49297n) & 0xffffffffn;
  hash = ((hash << 15n) ^ hash) & 0xffffffffn;
  hash = (hash * 11995408973635179863n) & 0xffffffffffffffffn;

  return Math.abs(Number(hash));
}

export function getDailySong() {
  // use the date as a random seed to ensure the same song is returned for the same day
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
  const hash = hashing(today);
  const randomIndex = hash % songs.length;
  const randomSong = songs[randomIndex];
  return randomSong;
}
