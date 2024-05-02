// Import required modules
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

// Create Express app
const app = express();

// Create database connection
const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '', // Password for your MySQL database
  database: 'chinformatiquebdd',
});

// Allow CORS for all origins
app.use(cors());

// Body parser middleware
app.use(express.json());

// Route for handling checkout
app.post("/checkout", (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    wilaya,
    commune,
    streetAddress,
    orderNotes,
    deliveryOption,
    paymentMethod,
    cart,
    deliveryCost,
  } = req.body;

  // Check if required fields are present
  if (!firstName || !lastName || !streetAddress || !phone || !wilaya || !commune || !Array.isArray(cart)) {
    return res.status(400).send("Missing or invalid data in the request.");
  }

  const fullAddress = `${streetAddress}, ${commune}, ${wilaya}, Algeria`;

  // Calculate total order price
  const totalOrderPrice = cart.reduce((total, product) => total + product.quantity * product.price, 700) + deliveryCost;

  // Insert into Orders table
  const orderQuery = "INSERT INTO Orders (nom, prenom, address, numTele, versement, note, typeLivraison, totalOrderPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(orderQuery, [lastName, firstName, fullAddress, phone, deliveryCost, orderNotes, deliveryOption, totalOrderPrice], (err, orderResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error processing order. Please try again.");
    }
    
    const orderId = orderResult.insertId;
// Prepare data for insertion into OrderLine table
const orderLineValues = cart.map(product => [
  orderId,
  product.idProduit,
  product.quantity,
  product.quantity * product.price, // Calculate totalPrice for each product separately
  product.name
]);
// Insert into OrderLine table
const orderLineQuery = "INSERT INTO OrderLine (idOrder, idProduit, quantity, totalPrice, productName) VALUES ?";
db.query(orderLineQuery, [orderLineValues], (err) => {
  if (err) {
    console.error(err);
    return res.status(500).send("Error processing order. Please try again.");
  }
  
  return res.status(200).send("Order successfully processed.");
});

  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






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

app.get("/products/related/:category", (req, res) => {
  const category = req.params.category;
  db.query(
    "SELECT * FROM produits WHERE namecategorie = ? OR namesubcategorie = ? OR namesubsubcategorie = ?",
    [category, category, category],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
});