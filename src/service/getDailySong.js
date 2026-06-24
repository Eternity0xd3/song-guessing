import songs from "../data/songs.json" with { type: "json" };

function hashing(str){
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash;
}

export function getDailySong() {
    // use the date as a random seed to ensure the same song is returned for the same day
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const hash = hashing(today);
    const randomIndex = hash % songs.length;
    const randomSong = songs[randomIndex];
    return randomSong;
}