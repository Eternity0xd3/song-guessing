import songs from "../data/songs.json" with { type: "json" };
import { compareVersions } from "compare-versions";

function parseLevel(level) {
  const num = parseFloat(level);
  if (level.includes("+")) {
    return num + 0.5;
  }
  return num;
}

// That messy stuff unexpectedly works well ?!
// I hope no bug emerges after I couldn't understand the logic completely.

// FIXME: 'Last' contains 2 beyond levels: '9/9+'! (It is defaultly intepreted as 9+)
export function compareSongs(selectedSong, targetedSong) {
  const isCorrect = selectedSong.id === targetedSong.id;
  const isSameArtist = selectedSong.artist_name === targetedSong.artist_name;
  const isSameAlbum = selectedSong.album_name === targetedSong.album_name;
  const isSameCatagory = selectedSong.catagory === targetedSong.catagory;
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
    eternalDirection = "-";
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
    beyondDirection = "-";
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
  return {
    isCorrect: isCorrect,
    isSameArtist: isSameArtist,
    isSameAlbum: isSameAlbum,
    isSameCatagory: isSameCatagory,
    bpmDirection: bpmDirection,
    futureDirection: futureDirection,
    eternalDirection: eternalDirection,
    beyondDirection: beyondDirection,
    versionDirection: versionDirection,
  };
}
