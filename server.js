// server.js - Complete Express server for Week 2 assignment

const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Custom Middleware

// 1. Request Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 2. Simple Authentication Middleware (for demonstration)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // For demo purposes, any Bearer token is accepted
  if (req.path === '/api/products' && req.method === 'GET') {
    // Public access for GET requests
    return next();
  }
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Token validation would go here in real application
    next();
  } else {
    res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please include a valid Bearer token in Authorization header'
    });
  }
};

// 3. Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
};

// Apply authentication to all product routes except GET
app.use('/api/products', (req, res, next) => {
  if (req.method !== 'GET') {
    authenticate(req, res, next);
  } else {
    next();
  }
});

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Product API!',
    endpoints: {
      'GET /api/products': 'Get all products',
      'GET /api/products/:id': 'Get specific product',
      'POST /api/products': 'Create new product (requires auth)',
      'PUT /api/products/:id': 'Update product (requires auth)',
      'DELETE /api/products/:id': 'Delete product (requires auth)'
    }
  });
});

// API Routes

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  const { category, inStock } = req.query;
  
  let filteredProducts = [...products];
  
  // Filter by category if provided
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filter by inStock if provided
  if (inStock !== undefined) {
    const stockFilter = inStock === 'true';
    filteredProducts = filteredProducts.filter(product => 
      product.inStock === stockFilter
    );
  }
  
  res.json({
    count: filteredProducts.length,
    products: filteredProducts
  });
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      error: 'Product not found',
      message: `Product with ID ${productId} does not exist`
    });
  }
  
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  
  // Validation
  if (!name || !description || !price || !category) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['name', 'description', 'price', 'category']
    });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      error: 'Invalid price',
      message: 'Price must be a positive number'
    });
  }
  
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock: inStock !== undefined ? inStock : true
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      error: 'Product not found',
      message: `Product with ID ${productId} does not exist`
    });
  }
  
  const { name, description, price, category, inStock } = req.body;
  
  // Update only provided fields
  const updatedProduct = {
    ...products[productIndex],
    ...(name && { name }),
    ...(description && { description }),
    ...(price !== undefined && { price }),
    ...(category && { category }),
    ...(inStock !== undefined && { inStock })
  };
  
  products[productIndex] = updatedProduct;
  
  res.json({
    message: 'Product updated successfully',
    product: updatedProduct
  });
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      error: 'Product not found',
      message: `Product with ID ${productId} does not exist`
    });
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
});

// 404 Handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
});

module.exports = app;