const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-button");
const searchSongListDiv = document.getElementById("search-song-list");
const resultsDiv = document.getElementById("results");
const resultTable = document.getElementById("result-table");
const dialog = document.getElementById("about-dialog");
const songs = [];
let attempts = [];
let seatchedSongs = [];

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
      body: JSON.stringify({ selectedSongId: Number(songId) }),
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
    searchSongListDiv.innerHTML = "No result...";
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

function addAndRefreshDisplayResults(selectedSong, result) {
  attempts.push({
    song: selectedSong,
    result: result,
  });

  resultTable.innerHTML = `
    <thead>
        <tr>
            <td>Title</td>
            <td>Artist</td>
            <td>Song Pack</td>
            <td>BPM</td>
            <td>Future Level</td>
            <td>Eternal Level</td>
            <td>Beyond Level</td>
            <td>Append Version</td>
        </tr>
    </thead>
    `;

  attempts.forEach((attempt, index) => {
    const eachSong = attempt.song;
    const eachResult = attempt.result;
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${eachSong.song_name || "-"}<hr>${eachResult.isCorrect}</td>
        <td>${eachSong.artist_name || "-"}<hr>${eachResult.isSameArtist}</td>
        <td>${eachSong.album_name || "-"}<hr>${eachResult.isSameAlbum}</td>
        <td>${eachSong.bpm || "-"}<hr>${eachResult.bpmDirection}</td>
        <td>${eachSong.future_level || "-"}<hr>${eachResult.futureDirection}</td>
        <td>${eachSong.eternal_level || "-"}<hr>${eachResult.eternalDirection}</td>
        <td>${eachSong.beyond_level || "-"}<hr>${eachResult.beyondDirection}</td>
        <td>${eachSong.append_version || "-"}<hr>${eachResult.versionDirection}</td>
        `;

    resultTable.appendChild(row);
  });
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
