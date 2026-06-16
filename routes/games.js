// routes/games.js
// Phase 2: all routes use res.render() with EJS templates.

const express = require('express');
const router  = express.Router();
const { getAllGames, getGameById, filterGames, getAllGenres, paginate } = require('../helpers/gameHelper');

// GET /games
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

// ── GET /games/search  must stay BEFORE /:id
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

// ── GET /games/add  ─────────────────────────────────────────────────────────
// Show the form for users to suggest/add a new game.
// This route must stay BEFORE /:id so Express does not treat "add" as an id.
router.get('/add', (req, res) => {
  const genres = getAllGenres();

  res.render('games/add', {
    errors: [],
    successMessage: '',
    formData: {},
    genres
  });
});

// POST /games
router.post('/', (req, res) => {

  const genres = getAllGenres();

  const {
    title,
    genre,
    rating,
    releaseDate,
    developer,
    summary
  } = req.body;

  const errors = [];

  // title validation
  if (!title || title.trim() === '') {
    errors.push('Title is required.');
  }

  // genre validation
  if (!genre || genre.trim() === '') {
    errors.push('Genre is required.');
  }

  // rating validation
  const ratingNumber = parseFloat(rating);

  if (!rating || isNaN(ratingNumber)) {
    errors.push('Rating must be a number.');
  } else if (ratingNumber < 0 || ratingNumber > 5) {
    errors.push('Rating must be between 0 and 5.');
  }

  // validation failed
  if (errors.length > 0) {

    return res.status(400).render('games/add', {
      errors,
      successMessage: '',
      genres,
      formData: req.body
    });

  }

  // validation success
  res.render('games/add', {
    successMessage: 'Game suggestion submitted successfully!',
    errors: [],
    genres,
    formData: {}
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
