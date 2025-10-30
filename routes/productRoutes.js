const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
let products = require('../data/products');

// 🟢 GET /api/products — List all products
router.get('/', (req, res) => {
  res.json(products);
});

// 🟢 GET /api/products/:id — Get product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// 🟢 POST /api/products — Create a new product
router.post('/', (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock: inStock ?? true
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// 🟢 PUT /api/products/:id — Update a product
router.put('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// 🟢 DELETE /api/products/:id — Delete a product
router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const deletedProduct = products.splice(index, 1);
  res.json({ message: 'Product deleted', deletedProduct });
});

module.exports = router;
