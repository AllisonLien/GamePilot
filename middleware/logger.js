// Simple request logger — logs method, URL, status, and response time.

function logger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} — ${ms}ms`);
  });

  next();
}

module.exports = logger;
