const { v4: uuidv4 } = require('uuid');

let products = [
  {
    id: uuidv4(),
    name: "Laptop",
    description: "A high-performance laptop",
    price: 1500,
    category: "Electronics",
    inStock: true
  },
  {
    id: uuidv4(),
    name: "Coffee Mug",
    description: "Ceramic mug for your morning coffee",
    price: 10,
    category: "Kitchen",
    inStock: true
  }
];

module.exports = products;
