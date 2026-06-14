const games = require('../data/games.json');

/**
 * Returns a page of items plus metadata.
 * @param {Array}  data     - array to paginate
 * @param {number} page     - 1-based page number
 * @param {number} perPage  - items per page
 */
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
function getAllGames() {
  return games;
}

// ── get one game by id 
function getGameById(id) {
  const numId = parseInt(id, 10);
  return games.find((g) => g.id === numId) || null;
}

// ── search / filter 
/**
 Filters games by optional genre and/or minimum rating.
 * Both params are optional; passing neither returns all games.
 */
function filterGames({ genre, minRating }) {
  let results = games;

  if (genre) {
    const q = genre.toLowerCase();
    results = results.filter((g) =>
      g.genres.some((gen) => gen.toLowerCase().includes(q))
    );
  }

  if (minRating !== undefined && !isNaN(minRating)) {
    const min = parseFloat(minRating);
    results = results.filter((g) => g.rating.score >= min);
  }

  return results;
}

function getAllGenres() {
  const genreSet = new Set();
  games.forEach((g) => g.genres.forEach((gen) => genreSet.add(gen)));
  return Array.from(genreSet).sort();
}

module.exports = { getAllGames, getGameById, filterGames, getAllGenres, paginate };
