// server.js
require('dotenv').config();

const express = require('express');
const path    = require('path');
const logger  = require('./middleware/logger');

const gamesRouter = require('./routes/games');
const apiRouter   = require('./routes/api');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── middleware 
app.use(express.json());                            // parse JSON bodies
app.use(express.urlencoded({ extended: true }));    // parse form bodies
app.use(express.static(path.join(__dirname, 'public'))); // static files
app.use(logger);                                    // custom request logger

// ── template engine 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── home route
app.get('/', (req, res) => {
  res.send(`
    <h1>GamePilot 🎮</h1>
    <p><em>Just PLAY it!</em></p>
    <p>A game discovery and recommendation platform.</p>
    <ul>
      <li><a href="/games">Browse all games (HTML)</a></li>
      <li><a href="/games/search">Search / filter games</a></li>
      <li><a href="/api/games?page=1&perPage=10">API — game list (JSON)</a></li>
      <li><a href="/api/status">API — status check (JSON)</a></li>
    </ul>
  `);
});

// ── routers 
app.use('/games', gamesRouter);
app.use('/api',   apiRouter);

// ── 404 handler 
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found', path: req.path });
  }
  res.status(404).send(`
    <h1>404 — Page Not Found</h1>
    <p>The route <strong>${req.path}</strong> does not exist.</p>
    <a href="/">Back to home</a>
  `);
});

// ── global error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (req.path.startsWith('/api')) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.status(500).send('<h1>500 — Internal Server Error</h1>');
});

// ── start 
app.listen(PORT, () => {
  console.log(`GamePilot running at http://localhost:${PORT}`);
});

module.exports = app;
