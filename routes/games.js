// routes/games.js
// Phase 2: all routes now use res.render() with EJS templates.

const express = require('express');
const router  = express.Router();
const { getAllGames, getGameById, filterGames, getAllGenres, paginate } = require('../helpers/gameHelper');

// ── GET /games  ──────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  let page    = parseInt(req.query.page)    || 1;
  let perPage = parseInt(req.query.perPage) || 10;

  if (isNaN(page)    || page < 1)    page    = 1;
  if (isNaN(perPage) || perPage < 1) perPage = 10;
  if (perPage > 50)                  perPage = 50;

  const { records, pagination } = paginate(getAllGames(), page, perPage);

  // passes: records, pagination
  res.render('games/index', { records, pagination });
});

// ── GET /games/search  ──────────────────────────────────────────────────────
// IMPORTANT: must stay BEFORE /:id
router.get('/search', (req, res) => {
  const { genre, minRating } = req.query;
  const results = filterGames({ genre, minRating });
  const genres  = getAllGenres();

  // passes: results, genres, genre, minRating
  res.render('games/search', {
    results,
    genres,
    genre:     genre     || '',
    minRating: minRating || '',
  });
});

// ── GET /games/:id  ─────────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const game = getGameById(req.params.id);

  if (!game) {
    return res.status(404).render('404', { id: req.params.id });
  }

  // passes: game
  res.render('games/detail', { game });
});

module.exports = router;
