// Custom logger middleware
const logger = (req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next(); // move to next middleware or route
};

module.exports = logger;
