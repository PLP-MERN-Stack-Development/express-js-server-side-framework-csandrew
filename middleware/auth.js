// Authentication middleware (API key check)
const auth = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; // header name: x-api-key

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }

  next();
};

module.exports = auth;
