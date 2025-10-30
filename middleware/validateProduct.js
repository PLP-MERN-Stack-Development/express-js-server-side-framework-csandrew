// Product validation middleware
const validateProduct = (req, res, next) => {
  const { name, price, description, category, inStock } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing name' });
  }

  if (price === undefined || typeof price !== 'number') {
    return res.status(400).json({ message: 'Invalid or missing price' });
  }

  // Optional fields are fine if provided
  if (description && typeof description !== 'string') {
    return res.status(400).json({ message: 'Description must be a string' });
  }

  if (category && typeof category !== 'string') {
    return res.status(400).json({ message: 'Category must be a string' });
  }

  if (inStock !== undefined && typeof inStock !== 'boolean') {
    return res.status(400).json({ message: 'inStock must be a boolean' });
  }

  next();
};

module.exports = validateProduct;
