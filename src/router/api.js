import { Router } from "express";
import {
  getSongById,
  searchSong,
  getAllSongs,
} from "../service/songServices.js";
import { getDailySong } from "../service/getDailySong.js";
import { compareSongs } from "../service/compareSongs.js";

const router = Router();

router.get('/song-list', (req, res) => {
    return res.json(getAllSongs());
});

router.get('/random-song', (req, res) => {
    return res.json(getDailySong());
});

router.get('/search', (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.json([]);
    }
    results = searchSong(query);
    return res.json(results);
});

router.get('/song/:id', (req, res) => {
    const id = Number(req.params.id);
    const song = getSongById(id);
    if(!song) {
        return res.status(404).json({ error: 'Invalid song ID' });
    }
    return res.json(song);
});

router.post('/guess', (req, res) => {
    const selectedSongId = req.body.selectedSongId;
    console.log('Received guess for song ID:', selectedSongId);
    const selectedSong = getSongById(selectedSongId);
    if (!selectedSong) {
        return res.status(404).json({ error: 'Invalid song ID' });
    }
    const dailySong = getDailySong();
    const result = compareSongs(selectedSong, dailySong);
    return res.json(result);
});

export default router;