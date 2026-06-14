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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger);

// ── template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── home route — Phase 2: renders views/index.ejs
app.get('/', (req, res) => {
  res.render('index');
});

// ── routers
app.use('/games', gamesRouter);
app.use('/api',   apiRouter);

// ── 404 handler — Phase 2: renders views/404.ejs
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found', path: req.path });
  }
  res.status(404).render('404', { id: req.path });
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
