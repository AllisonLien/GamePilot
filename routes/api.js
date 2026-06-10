// routes/api.js
// JSON API endpoints — all responses are application/json.

const express = require('express');
const router  = express.Router();
const { getAllGames, getGameById, filterGames, paginate } = require('../helpers/gameHelper');

// ── GET /api/games?page=1&perPage=10  ────────────────────────────────────────
// Paginated JSON list. Supports optional genre and minRating filters too.
router.get('/games', (req, res) => {
  let page    = parseInt(req.query.page)    || 1;
  let perPage = parseInt(req.query.perPage) || 10;

  // validate query params
  if (isNaN(page)    || page < 1)    page    = 1;
  if (isNaN(perPage) || perPage < 1) perPage = 10;
  if (perPage > 50)                  perPage = 50;

  // optional filters
  const { genre, minRating } = req.query;
  const dataset = (genre || minRating)
    ? filterGames({ genre, minRating })
    : getAllGames();

  const { records, pagination } = paginate(dataset, page, perPage);

  res.json({ pagination, records });
});

// ── GET /api/games/:id  ──────────────────────────────────────────────────────
// Single game as JSON.
router.get('/games/:id', (req, res) => {
  const game = getGameById(req.params.id);

  if (!game) {
    return res.status(404).json({ error: 'Game not found', id: req.params.id });
  }

  res.json(game);
});

// ── POST /api/games/suggest  ─────────────────────────────────────────────────
// Placeholder for Phase 2 — accepts a suggestion but does not persist yet.
router.post('/games/suggest', (req, res) => {
  const { title, genre, rating } = req.body || {};

  if (!title) {
    return res.status(400).json({ error: 'Validation failed', message: 'title is required' });
  }

  // Phase 1: mock response (no persistence yet)
  res.status(201).json({
    message: 'Suggestion received (mock — persistence added in Phase 2)',
    suggestion: { title, genre, rating },
  });
});

// ── PUT /api/games/:id  ──────────────────────────────────────────────────────
// Placeholder update route — simulated in Phase 1, real in Phase 2.
router.put('/games/:id', (req, res) => {
  const game = getGameById(req.params.id);

  if (!game) {
    return res.status(404).json({ error: 'Game not found', id: req.params.id });
  }

  // Phase 1: simulate update (no file write yet)
  const { rating, isActive } = req.body || {};
  const updated = { ...game };
  if (rating  !== undefined) updated.rating.score = parseFloat(rating);
  if (isActive !== undefined) updated.isActive = Boolean(isActive);

  res.json({
    message: 'Update simulated (mock — persistence added in Phase 2)',
    updated,
  });
});

// ── GET /api/status  ─────────────────────────────────────────────────────────
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
