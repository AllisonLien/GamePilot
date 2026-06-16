// routes/games.js
// Phase 2: all routes use res.render() with EJS templates.

const express = require('express');
const router  = express.Router();
const { getAllGames, getGameById, filterGames, getAllGenres, paginate, addGame } = require('../helpers/gameHelper');

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

  // release date validation
  if (!releaseDate || releaseDate.trim() === '') {
    errors.push('Release Date is required.');
  } else if (isNaN(Date.parse(releaseDate))) {
    errors.push('Release Date must be a valid date.');
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

const formattedReleaseDate = new Date(releaseDate).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const newGame = {
  id: getAllGames().length + 1,
  title: title.trim(),
  releaseDate: formattedReleaseDate,
  developer: developer ? [developer.trim()] : ['Unknown'],
  genres: [genre],
  rating: {
    score: ratingNumber,
    reviewCount: '0'
  },
  communityStats: {
    plays: '0',
    playing: '0',
    backlogs: '0',
    wishlist: '0'
  },
  summary: summary && summary.trim() !== '' ? summary.trim() : 'No summary available.',
  imageUrl: `https://placehold.co/300x400/1a1d2e/6c63ff?text=${encodeURIComponent(title.trim())}`,
  isActive: true
};

addGame(newGame);

res.render('games/add', {
  successMessage: 'Game suggestion submitted successfully and saved to the dataset!',
  errors: [],
  genres,
  formData: {},
  newGame
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
