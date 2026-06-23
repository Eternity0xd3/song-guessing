const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-button")
const searchSongListDiv = document.getElementById("search-song-list");
const resultsDiv = document.getElementById("results");
const songs = [];
let attempts = []
let seatchedSongs = [];

async function getSongs(){
    resJson = await (await fetch("/api/song-list")).json();
    songs.push(...resJson);
}

async function toggleGuess(songDiv){
    const songId = songDiv.dataset.songId;
    const songData = await (await fetch(`/api/song/${songId}`)).json();
    const guessResult = await (await fetch("/api/guess", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ selectedSongId: Number(songId) })
    })).json();
    console.log(guessResult);
    addAndRefreshDisplayResults(songData, guessResult);
}

function displaySelections(songs) {
    console.log(songs);
    searchSongListDiv.innerHTML = "";
    searchSongListDiv.style.display = "block";
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
        "song": selectedSong, 
        "result": result
    });

    resultsDiv.innerHTML = "";
    attempts.forEach((attempt, index) => {
        const attemptDiv = document.createElement("div");
        attemptDiv.classList.add("attempt");
        attemptDiv.innerHTML = `
            <p>Your guess: ${JSON.stringify(attempt.song)}</p>
            <p>Results: ${JSON.stringify(attempt.result)}</p>
            <p>------------------------------------------<p>
        `;
        resultsDiv.appendChild(attemptDiv);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getSongs();
    console.log(songs);
})
document.addEventListener("keydown", (event) => {
    if(event.key === "Enter"){
        searchBtn.click();
    }
})

searchBtn.addEventListener("click", async () => {
    const input = searchBar.value;
    if(!input){
        return;
    }

    // There are 2 available methods: frontend filter or backend search
    const filteredSongs = []
    filteredSongs.push(...songs.filter(song => song.song_name.toLowerCase().includes(input.toLowerCase())));
    filteredSongs.push(...songs.filter(song => song.artist_name.toLowerCase().includes(input.toLowerCase()) && !filteredSongs.includes(song)));
    searchedSongs = filteredSongs;
    displaySelections(searchedSongs);
    // ----------------------------------

})