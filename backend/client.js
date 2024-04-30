const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

// Create database connection
const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'chinformatiquebdd',
});

// Allow CORS for all origins
app.use(cors({
    origin: 'http://localhost:5173'
  }));
  

// Body parser middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/shop", (req, res) => {
  db.query("SELECT * FROM produits", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result);
    }
  });
});

/// Fetch details for a specific product by ID
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  db.query("SELECT * FROM produits WHERE idProduit = ?", [productId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      if (result.length === 0) {
        res.status(404).send("Product Not Found");
      } else {
        res.send(result[0]);
      }
    }
  });
});

// Add a new route to fetch related products by category
app.get("/products/related/:category", (req, res) => {
  const category = req.params.category;
  db.query("SELECT * FROM produits WHERE namecategorie = ?", [category], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result);
    }
  });
});



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
