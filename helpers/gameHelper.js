// helpers/gameHelper.js
const Game = require('../models/Game');

// ── paginate (stays the same — works on any array)
function paginate(data, page, perPage) {
  const totalRecords = data.length;
  const totalPages   = Math.ceil(totalRecords / perPage);
  const safePage     = Math.min(Math.max(page, 1), totalPages || 1);
  const start        = (safePage - 1) * perPage;
  const records      = data.slice(start, start + perPage);

  return {
    records,
    pagination: {
      page:         safePage,
      perPage,
      totalRecords,
      totalPages,
      hasNextPage:  safePage < totalPages,
      hasPrevPage:  safePage > 1,
    },
  };
}

// ── get all games
async function getAllGames() {
  return await Game.find({}).lean();
}

// ── get one game by id
async function getGameById(id) {
  const numId = parseInt(id, 10);
  return await Game.findOne({ id: numId }).lean();
}

// ── search / filter
async function filterGames({ genre, minRating }) {
  const query = {};

  if (genre) {
    query.genres = { $regex: genre, $options: 'i' };
  }

  if (minRating !== undefined && !isNaN(minRating)) {
    query['rating.score'] = { $gte: parseFloat(minRating) };
  }

  return await Game.find(query).lean();
}

// ── get all genres
async function getAllGenres() {
  const genres = await Game.distinct('genres');
  return genres.sort();
}

// ── add a new game
async function addGame(newGame) {
  const game = new Game(newGame);
  await game.save();
  return game;
}

module.exports = {
  getAllGames,
  getGameById,
  filterGames,
  getAllGenres,
  paginate,
  addGame
};