// routes/games.js
const express = require('express');
const router  = express.Router();
const { getAllGames, getGameById, filterGames, getAllGenres, paginate, addGame } = require('../helpers/gameHelper');

// GET /games
router.get('/', async (req, res) => {
  try {
    let page    = parseInt(req.query.page)    || 1;
    let perPage = parseInt(req.query.perPage) || 10;

    if (isNaN(page)    || page < 1)    page    = 1;
    if (isNaN(perPage) || perPage < 1) perPage = 10;
    if (perPage > 50)                  perPage = 50;

    const allGames = await getAllGames();
    const { records, pagination } = paginate(allGames, page, perPage);

    res.render('games/index', { records, pagination });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /games/search — must stay BEFORE /:id
router.get('/search', async (req, res) => {
  try {
    const { genre, minRating } = req.query;
    const results = await filterGames({ genre, minRating });
    const genres  = await getAllGenres();

    res.render('games/search', {
      results,
      genres,
      genre:     genre     || '',
      minRating: minRating || '',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /games/add — must stay BEFORE /:id
router.get('/add', async (req, res) => {
  try {
    const genres = await getAllGenres();
    res.render('games/add', {
      errors: [],
      successMessage: '',
      formData: {},
      genres
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /games
router.post('/', async (req, res) => {
  try {
    const genres = await getAllGenres();
    const { title, genre, rating, releaseDate, developer, summary } = req.body;
    const errors = [];

    if (!title || title.trim() === '')         errors.push('Title is required.');
    if (!genre || genre.trim() === '')         errors.push('Genre is required.');
    if (!releaseDate || releaseDate.trim() === '') errors.push('Release Date is required.');
    else if (isNaN(Date.parse(releaseDate)))   errors.push('Release Date must be a valid date.');

    const ratingNumber = parseFloat(rating);
    if (!rating || isNaN(ratingNumber))        errors.push('Rating must be a number.');
    else if (ratingNumber < 0 || ratingNumber > 5) errors.push('Rating must be between 0 and 5.');

    if (errors.length > 0) {
      return res.status(400).render('games/add', {
        errors,
        successMessage: '',
        genres,
        formData: req.body
      });
    }

    const allGames = await getAllGames();
    const formattedReleaseDate = new Date(releaseDate).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });

    const newGame = {
      id: allGames.length + 1,
      title: title.trim(),
      releaseDate: formattedReleaseDate,
      developer: developer ? [developer.trim()] : ['Unknown'],
      genres: [genre],
      rating: { score: ratingNumber, reviewCount: '0' },
      communityStats: { plays: '0', playing: '0', backlogs: '0', wishlist: '0' },
      summary: summary && summary.trim() !== '' ? summary.trim() : 'No summary available.',
      imageUrl: `https://placehold.co/300x400/1a1d2e/6c63ff?text=${encodeURIComponent(title.trim())}`,
      isActive: true
    };

    await addGame(newGame);

    res.render('games/add', {
      successMessage: 'Game suggestion submitted successfully and saved to the database!',
      errors: [],
      genres,
      formData: {},
      newGame
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /games/:id
router.get('/:id', async (req, res) => {
  try {
    const game = await getGameById(req.params.id);
    if (!game) {
      return res.status(404).render('404', { id: req.params.id });
    }
    res.render('games/detail', { game });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;