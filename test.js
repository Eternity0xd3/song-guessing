import {compareVersions} from "compare-versions";

// TODO: complete the logic here
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
            targetedSong.append_version,
          ) === 1
        ? "larger"
        : "smaller";
  console.log(versionDirection);
}

const select = {
  id: 8,
  song_name: "Lost Civilization",
  artist_name: "Laur vs CK",
  past_level: "4",
  present_level: "7",
  future_level: "11+",
  eternal_level: "",
  beyond_level: "9+",
  song_length: "2:04",
  bpm: "100",
  album_name: "Arcaea",
  append_version: "1.0.5",
};

const target = {
  id: 31,
  song_name: "DataErr0r",
  artist_name: "Cosmograph",
  past_level: "3",
  present_level: "7",
  future_level: "9+",
  eternal_level: "11",
  beyond_level: "10",
  song_length: "2:05",
  bpm: "100",
  album_name: "Memory Archive",
  append_version: "1.0.5",
};

compareSongs(select, target);
