// routes/api.js
// JSON API endpoints — all responses are application/json.

const express = require('express');
const router  = express.Router();
const { getAllGames, getGameById, filterGames, paginate } = require('../helpers/gameHelper');

// /api/games?page=1&perPage=10  
router.get('/games', (req, res) => {
  let page    = parseInt(req.query.page)    || 1;
  let perPage = parseInt(req.query.perPage) || 10;

  // validate query params
  if (isNaN(page)    || page < 1)    page    = 1;
  if (isNaN(perPage) || perPage < 1) perPage = 10;
  if (perPage > 50)                  perPage = 50;

const { genre, minRating } = req.query;
let dataset; 
if (genre || minRating) {
  dataset = filterGames({ genre, minRating }); 
} else {
  dataset = getAllGames();
}

  const { records, pagination } = paginate(dataset, page, perPage);

  res.json({ pagination, records });
});

///api/games/:id
// Single game as JSON.
router.get('/games/:id', (req, res) => {
  const game = getGameById(req.params.id);

  if (!game) {
    return res.status(404).json({ error: 'Game not found', id: req.params.id });
  }

  res.json(game);
});

//POST /api/games/suggest 
router.post('/games/suggest', (req, res) => {
  const { title, genre, rating } = req.body || {};

  if (!title) {
    return res.status(400).json({ error: 'Validation failed', message: 'title is required' });
  }

  // Phase 1: mock response 
  res.status(201).json({
    message: 'Suggestion received (mock — persistence added in Phase 2)',
    suggestion: { title, genre, rating },
  });
});

// /api/games/:id 
router.put('/games/:id', (req, res) => {
  const game = getGameById(req.params.id);

  if (!game) {
    return res.status(404).json({ error: 'Game not found', id: req.params.id });
  }

  // 
  const { rating, isActive } = req.body || {};
  const updated = { ...game };
  if (rating  !== undefined) updated.rating.score = parseFloat(rating);
  if (isActive !== undefined) updated.isActive = Boolean(isActive);

  res.json({
    message: 'Update simulated (mock — persistence added in Phase 2)',
    updated,
  });
});

//api/status  
router.get('/status', (req, res) => {
  const games = getAllGames();
  res.json({
    app:         'GamePilot',
    release:     '1.0',
    team:        ['Yichun Lien', 'Maria Catherine Jaramillo', 'Yung-Lun Lee'],
    status:      'ok',
    recordCount: games.length,
    timestamp:   new Date().toISOString(),
  });
});

module.exports = router;
