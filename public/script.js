const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-button");
const searchSongListDiv = document.getElementById("search-song-list");
const resultsDiv = document.getElementById("results");
const guessResults = document.getElementById("guess-results");
const dialog = document.getElementById("about-dialog");
const songs = [];
let attempts = [];
let searchedSongs = [];
let randomseed = 0;

// gamemode
const randomMode = true; // if true, the daily song will be random, otherwise it will be the same every day

if(randomMode) {
  randomseed = Math.floor(Math.random() * 1000000); // random seed for the random song
}
let isDesktop = navigator["userAgent"].match(
  /(ipad|iphone|ipod|android|windows phone)/i,
)
  ? false
  : true;

// map
const resultMap = {
  "true": "正确",
  "false": "错误",
  "correct": "正确",
  "larger": "太大",
  "smaller": "太小",
  "in range": "在范围内",
  "overlap": "有重叠",
}
function mappingResult(result) {
  result = result.toString();
  return resultMap[result] || result;
}

async function getSongs() {
  resJson = await (await fetch("/api/song-list")).json();
  songs.push(...resJson);
}

async function toggleGuess(songDiv) {
  const songId = songDiv.dataset.songId;
  const songData = await (await fetch(`/api/song/${songId}`)).json();
  const guessResult = await (
    await fetch("/api/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedSongId: Number(songId),
        seed: randomseed
       }),
    })
  ).json();
  addAndRefreshDisplayResults(songData, guessResult);
}

function searchSongs() {
  const input = searchBar.value;
  if (!input) {
    displaySelections([]);
    return;
  }
  const filteredSongs = [];
  filteredSongs.push(
    ...songs.filter((song) =>
      song.song_name.toLowerCase().includes(input.toLowerCase()),
    ),
  );
  filteredSongs.push(
    ...songs.filter(
      (song) =>
        song.artist_name.toLowerCase().includes(input.toLowerCase()) &&
        !filteredSongs.includes(song),
    ),
  );
  searchedSongs = filteredSongs;
  displaySelections(searchedSongs);
}

function displaySelections(songs) {
  searchSongListDiv.innerHTML = "";
  searchSongListDiv.style.display = "block";
  if (songs.length === 0) {
    searchSongListDiv.style.display = "none";
  }
  songs.forEach((song) => {
    const childDiv = document.createElement("div");
    childDiv.textContent = `${song.song_name} - ${song.artist_name}`;
    childDiv.classList.add("song-selection");
    childDiv.dataset.songId = song.id;
    childDiv.addEventListener("click", () => toggleGuess(childDiv));
    searchSongListDiv.appendChild(childDiv);
  });
}

function generatePropertyDiv(key, value, result, isTotallyCorrect) {
  divContent = `
    <div class="property${(result === "correct" || result.toString() === "true" || isTotallyCorrect) ? " correct" : ""}">
      <span class="property-label">${key}</span>
      <br>
      <span class="property-value">${value || "-"}</span>
      <hr>
      <span class="property-result">${mappingResult(result)}</span>
    </div>
    `;
    return divContent;
}

function generateGuessCard(attempt) {
  const eachSong = attempt.song;
  const eachResult = attempt.result;
  const element = document.createElement("div");
  element.classList.add("guess-card");
  let titleDiv = `
    <div class="song-title${eachResult.isCorrect ? " correct" : ""}">
      ${eachSong.song_name || "-"}
    </div>
  `;

  // isTotallyCorrect: if the song is correct, then all properties are correct
  // the argument is used because some of the arguments are missing,
  // and the result is not correct, but the song is correct, so we need to mark all properties as correct

  let propertiesDiv = `
    <div class="properties">
      ${generatePropertyDiv("曲师", eachSong.artist_name, eachResult.isSameArtist, eachResult.isCorrect)}
      ${generatePropertyDiv("曲包", eachSong.album_name, eachResult.isSameAlbum, eachResult.isCorrect)}
      ${generatePropertyDiv("曲包分类", eachSong.catagory, eachResult.isSameCatagory, eachResult.isCorrect)}
      ${generatePropertyDiv("BPM", eachSong.bpm, eachResult.bpmDirection, eachResult.isCorrect)}
      ${generatePropertyDiv("Future", eachSong.future_level, eachResult.futureDirection, eachResult.isCorrect)}
      ${generatePropertyDiv("Eternal", eachSong.eternal_level, eachResult.eternalDirection, eachResult.isCorrect)}
      ${generatePropertyDiv("Beyond", eachSong.beyond_level, eachResult.beyondDirection, eachResult.isCorrect)}
      ${generatePropertyDiv("添加版本", eachSong.append_version, eachResult.versionDirection, eachResult.isCorrect)}
    </div>
  `;
  element.innerHTML = titleDiv + propertiesDiv;
  return element;
}

function addAndRefreshDisplayResults(selectedSong, result) {
  attempts.push({
    song: selectedSong,
    result: result,
  });

  // clear the search bar and hide the search results
  searchBar.value = "";
  searchSongs();

  // display the guess results
  guessResults.innerHTML = "";

  attempts.forEach((attempt, index) => {
    eachGuessCard = generateGuessCard(attempt);
    guessResults.appendChild(eachGuessCard);
  });

  // automatically scroll to the bottom of the guess results
  resultsDiv.scrollTop = resultsDiv.scrollHeight;

  // focus back to the search bar for the next guess (except on touch devices)
  if (isDesktop) {
    searchBar.focus();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getSongs();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchSongs();
  }
});

searchBtn.addEventListener("click", searchSongs);

searchBar.addEventListener("input", searchSongs);

document.getElementById("about-btn").addEventListener("click", () => {
  dialog.showModal();
});

document.getElementById("close-dialog").addEventListener("click", () => {
  dialog.close();
});


dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();

  const inside =
    rect.top <= event.clientY &&
    event.clientY <= rect.bottom &&
    rect.left <= event.clientX &&
    event.clientX <= rect.right;

  if (!inside) {
    dialog.close();
  }
});
