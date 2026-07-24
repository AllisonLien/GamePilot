// routes/api.js
const express = require('express');
const router  = express.Router();
const { getAllGames, getGameById, filterGames, paginate, addGame } = require('../helpers/gameHelper');

// GET /api/games?page=1&perPage=10
router.get('/games', async (req, res) => {
  try {
    let page    = parseInt(req.query.page)    || 1;
    let perPage = parseInt(req.query.perPage) || 10;

    if (isNaN(page)    || page < 1)    page    = 1;
    if (isNaN(perPage) || perPage < 1) perPage = 10;
    if (perPage > 50)                  perPage = 50;

    const { genre, minRating } = req.query;
    const dataset = (genre || minRating)
      ? await filterGames({ genre, minRating })
      : await getAllGames();

    const { records, pagination } = paginate(dataset, page, perPage);
    res.json({ pagination, records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/games/:id
router.get('/games/:id', async (req, res) => {
  try {
    const game = await getGameById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found', id: req.params.id });
    }
    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/games/suggest
router.post('/games/suggest', async (req, res) => {
  try {
    const { title, genre, rating } = req.body || {};
    if (!title) {
      return res.status(400).json({ error: 'Validation failed', message: 'title is required' });
    }
    res.status(201).json({
      message: 'Suggestion received',
      suggestion: { title, genre, rating },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/games/:id
router.put('/games/:id', async (req, res) => {
  try {
    const game = await getGameById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found', id: req.params.id });
    }
    const { rating, isActive } = req.body || {};
    const updated = { ...game };
    if (rating   !== undefined) updated.rating.score = parseFloat(rating);
    if (isActive !== undefined) updated.isActive = Boolean(isActive);

    res.json({
      message: 'Update simulated',
      updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/status
router.get('/status', async (req, res) => {
  try {
    const games = await getAllGames();
    res.json({
      app:         'GamePilot',
      release:     '2.0',
      team:        ['Yichun Lien', 'Maria Catherine Jaramillo', 'Yung-Lun Lee'],
      status:      'ok',
      recordCount: games.length,
      timestamp:   new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;