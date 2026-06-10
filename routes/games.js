// routes/games.js
// HTML-facing routes. Phase 1 returns plain HTML strings.
// In Phase 2, swap res.send(...) calls for res.render('viewName', data).

const express = require('express');
const router  = express.Router();
const { getAllGames, getGameById, filterGames, getAllGenres, paginate } = require('../helpers/gameHelper');

// ── GET /games  ─────────────────────────────────────────────────────────────
// Paginated game list.
router.get('/', (req, res) => {
  let page    = parseInt(req.query.page)    || 1;
  let perPage = parseInt(req.query.perPage) || 10;

  // validate
  if (isNaN(page)    || page < 1)    page    = 1;
  if (isNaN(perPage) || perPage < 1) perPage = 10;
  if (perPage > 50)                  perPage = 50; // cap

  const { records, pagination } = paginate(getAllGames(), page, perPage);

  // Phase 1: plain HTML — replace with res.render('games/index', {...}) in Phase 2
  const rows = records.map((g) =>
    `<tr>
      <td>${g.id}</td>
      <td><a href="/games/${g.id}">${g.title}</a></td>
      <td>${g.genres.join(', ')}</td>
      <td>${g.rating.score}</td>
      <td>${g.releaseDate}</td>
    </tr>`
  ).join('');

  const navLinks = `
    ${pagination.hasPrevPage ? `<a href="/games?page=${pagination.page - 1}&perPage=${perPage}">← Prev</a>` : ''}
    &nbsp; Page ${pagination.page} of ${pagination.totalPages} &nbsp;
    ${pagination.hasNextPage ? `<a href="/games?page=${pagination.page + 1}&perPage=${perPage}">Next →</a>` : ''}
  `;

  res.send(`
    <h1>GamePilot — Game Catalogue</h1>
    <p>Total games: ${pagination.totalRecords}</p>
    <p><a href="/games/search">Search / Filter</a></p>
    <table border="1" cellpadding="6">
      <thead><tr><th>ID</th><th>Title</th><th>Genres</th><th>Rating</th><th>Release Date</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p>${navLinks}</p>
    <p><small><a href="/">Home</a></small></p>
  `);
});

// ── GET /games/search  ──────────────────────────────────────────────────────
// IMPORTANT: this route must be BEFORE /games/:id so Express doesn't treat
// "search" as an id param.
router.get('/search', (req, res) => {
  const { genre, minRating } = req.query;
  const results = filterGames({ genre, minRating });
  const genres  = getAllGenres();

  const rows = results.slice(0, 50).map((g) =>
    `<tr>
      <td>${g.id}</td>
      <td><a href="/games/${g.id}">${g.title}</a></td>
      <td>${g.genres.join(', ')}</td>
      <td>${g.rating.score}</td>
    </tr>`
  ).join('');

  const genreOptions = genres.map((gen) =>
    `<option value="${gen}" ${genre === gen ? 'selected' : ''}>${gen}</option>`
  ).join('');

  res.send(`
    <h1>GamePilot — Search Games</h1>
    <form method="GET" action="/games/search">
      <label>Genre:
        <select name="genre">
          <option value="">All genres</option>
          ${genreOptions}
        </select>
      </label>
      &nbsp;
      <label>Min rating:
        <input type="number" name="minRating" min="0" max="5" step="0.1" value="${minRating || ''}">
      </label>
      &nbsp;
      <button type="submit">Search</button>
      <a href="/games/search">Clear</a>
    </form>
    <p>${results.length} game(s) found</p>
    <table border="1" cellpadding="6">
      <thead><tr><th>ID</th><th>Title</th><th>Genres</th><th>Rating</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p><small><a href="/games">Back to catalogue</a></small></p>
  `);
});

// ── GET /games/:id  ─────────────────────────────────────────────────────────
// Single game detail.
router.get('/:id', (req, res) => {
  const game = getGameById(req.params.id);

  if (!game) {
    return res.status(404).send(`
      <h1>404 — Game Not Found</h1>
      <p>No game with id <strong>${req.params.id}</strong> exists.</p>
      <a href="/games">Back to catalogue</a>
    `);
  }

  res.send(`
    <h1>${game.title}</h1>
    <img src="${game.imageUrl}" alt="${game.title}" style="width:150px">
    <p><strong>Genres:</strong> ${game.genres.join(', ')}</p>
    <p><strong>Developer(s):</strong> ${game.developer.join(', ')}</p>
    <p><strong>Release Date:</strong> ${game.releaseDate}</p>
    <p><strong>Rating:</strong> ${game.rating.score} (${game.rating.reviewCount} reviews)</p>
    <p><strong>Community Stats:</strong>
      Plays: ${game.communityStats.plays} |
      Playing: ${game.communityStats.playing} |
      Backlogs: ${game.communityStats.backlogs} |
      Wishlist: ${game.communityStats.wishlist}
    </p>
    <p>${game.summary}</p>
    <p><a href="/games">Back to catalogue</a></p>
  `);
});

module.exports = router;
