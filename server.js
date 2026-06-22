import express from 'express';
import { compareVersions } from 'compare-versions';
import songs from './data/songs.json' with { type: 'json' };

const app = express();
const port = 3000;

function getDailySong() {
  // use the date as a random seed to ensure the same song is returned for the same day
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
  // simple hashing
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash * 31 + today.charCodeAt(i)) >>> 0;
  }
  const randomIndex = hash % songs.length;
  const randomSong = songs[randomIndex];
  return randomSong;
}

// TODO: Complete the logic
// seemingly complete?
function compareSongs(selectedSong, targetedSong) {
    const isCorrect = selectedSong.id === targetedSong.id;
    const isSameArtist = selectedSong.artist_name === targetedSong.artist_name;
    const isSameAlbum = selectedSong.album_name === targetedSong.album_name;
    console.log(isCorrect, isSameArtist, isSameAlbum);
  
    // handle the BPM feedback
    let selectedSongBpmDetail;
    let targetedSongBpmDetail;
    if (selectedSong.bpm.includes("-")) {
        const lowerBpm = Number(selectedSong.bpm.split("-")[0]);
        const higherBpm = Number(selectedSong.bpm.split("-")[1]);
        selectedSongBpmDetail = {
            isRange: true,
            lowerBpm: lowerBpm,
            higherBpm: higherBpm,
        };
    } else {
        selectedSongBpmDetail = {
            isRange: false,
            lowerBpm: Number(selectedSong.bpm),
            higherBpm: Number(selectedSong.bpm),
        };
    }
    if (targetedSong.bpm.includes("-")) {
        const lowerBpm = Number(targetedSong.bpm.split("-")[0]);
        const higherBpm = Number(targetedSong.bpm.split("-")[1]);
        targetedSongBpmDetail = {
            isRange: true,
            lowerBpm: lowerBpm,
            higherBpm: higherBpm,
        };
    } else {
        targetedSongBpmDetail = {
            isRange: false,
            lowerBpm: Number(targetedSong.bpm),
            higherBpm: Number(targetedSong.bpm),
        };
    }
    console.log(JSON.stringify(selectedSongBpmDetail));
    console.log(JSON.stringify(targetedSongBpmDetail));
    let bpmDirection;
    if (
        selectedSongBpmDetail.isRange === false &&
        targetedSongBpmDetail.isRange === false
    ) {
        const direction =
            selectedSongBpmDetail.higherBpm === targetedSongBpmDetail.higherBpm
                ? "correct"
                : selectedSongBpmDetail.higherBpm > targetedSongBpmDetail.higherBpm
                    ? "larger"
                    : "smaller";
        bpmDirection = direction;
    } else if (
        selectedSongBpmDetail.isRange === true &&
        targetedSongBpmDetail.isRange === false
    ) {
        const direction =
            selectedSongBpmDetail.higherBpm >= targetedSongBpmDetail.higherBpm &&
            selectedSongBpmDetail.lowerBpm <= targetedSongBpmDetail.lowerBpm
                ? "in range"
                : selectedSongBpmDetail.lowerBpm > targetedSongBpmDetail.higherBpm
                    ? "larger"
                    : "smaller";
        bpmDirection = direction;
    } else if (
        selectedSongBpmDetail.isRange === false &&
        targetedSongBpmDetail.isRange === true
    ) {
        const direction =
            selectedSongBpmDetail.higherBpm <= targetedSongBpmDetail.higherBpm &&
            selectedSongBpmDetail.lowerBpm >= targetedSongBpmDetail.lowerBpm
                ? "in range"
                : selectedSongBpmDetail.lowerBpm > targetedSongBpmDetail.higherBpm
                    ? "larger"
                    : "smaller";
        bpmDirection = direction;
    } else if (
        selectedSongBpmDetail.isRange === true &&
        targetedSongBpmDetail.isRange === true
    ) {
        const direction =
            selectedSongBpmDetail.lowerBpm <= targetedSongBpmDetail.higherBpm &&
            targetedSongBpmDetail.lowerBpm <= selectedSongBpmDetail.higherBpm
                ? "overlap"
                : selectedSongBpmDetail.lowerBpm > targetedSongBpmDetail.higherBpm
                    ? "larger"
                    : "smaller";
        bpmDirection = direction;
    }
    console.log(bpmDirection);
  
    // handle the level feedback
    // future level
    function parseLevel(level) {
        const num = parseFloat(level);
        if (level.includes("+")) {
            return num + 0.5;
        }
        return num;
    }
    const futureDirection =
        parseLevel(selectedSong.future_level) ===
        parseLevel(targetedSong.future_level)
            ? "correct"
            : parseLevel(selectedSong.future_level) > 
              parseLevel(targetedSong.future_level)
                ? "larger"
                : "smaller";
    console.log(futureDirection);
  
    // eternal level
    let eternalDirection;
    if (!selectedSong.eternal_level || !targetedSong.eternal_level) {
        eternalDirection = "N/A";
    } else {
        eternalDirection =
            parseLevel(selectedSong.eternal_level) ===
            parseLevel(targetedSong.eternal_level)
                ? "correct"
                : parseLevel(selectedSong.eternal_level) >
                  parseLevel(targetedSong.eternal_level)
                    ? "larger"
                    : "smaller";
    }
    console.log(eternalDirection);
  
    // beyond level
    let beyondDirection;
    if (!selectedSong.beyond_level || !targetedSong.beyond_level) {
        beyondDirection = "N/A";
    } else {
        beyondDirection =
            parseLevel(selectedSong.beyond_level) ===
            parseLevel(targetedSong.beyond_level)
                ? "correct"
                : parseLevel(selectedSong.beyond_level) >
                  parseLevel(targetedSong.beyond_level)
                    ? "larger"
                    : "smaller";
    }
    console.log(beyondDirection);
  
    // handle version feedback
    const versionDirection =
        compareVersions(
            selectedSong.append_version,
            targetedSong.append_version,
        ) === 0
            ? "correct"
            : compareVersions(
                selectedSong.append_version,
                targetedSong.append_version
                ) === 1
                    ? "larger"
                    : "smaller";
    console.log(versionDirection);
    return {
        "isCorrect": isCorrect,
        "isSameArtist": isSameArtist,
        "isSameAlbum": isSameAlbum,
        "bpmDirection": bpmDirection,
        "futureDirection": futureDirection,
        "eternalDirection": eternalDirection,
        "beyondDirection": beyondDirection,
        "versionDirection": versionDirection,
    }
}

app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    return res.send('Hello, World!');
});

app.get('/api/song-list', (req, res) => {
    return res.json(songs);
});

app.get('/api/random-song', (req, res) => {
    return res.json(getDailySong());
});

app.get('/api/search', (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.json([]);
    }
    let queryLower = query.toLowerCase();
    const results = songs.filter(song => 
        song.song_name.toLowerCase().includes(queryLower) ||
        song.artist_name.toLowerCase().includes(queryLower)
    );
    return res.json(results);
});

app.get('/api/song/:id', (req, res) => {
    const id = Number(req.params.id);
    const song = songs.find(s => s.id === id);
    if(!song) {
        return res.status(404).json({ error: 'Invalid song ID' });
    }
    return res.json(song);
});

app.post('/api/guess', (req, res) => {
    const selectedSongId = req.body.selectedSongId;
    console.log('Received guess for song ID:', selectedSongId);
    const selectedSong = songs.find(s => s.id === selectedSongId);
    if (!selectedSong) {
        return res.status(404).json({ error: 'Invalid song ID' });
    }
    const dailySong = getDailySong();
    const result = compareSongs(selectedSong, dailySong);
    return res.json(result);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});