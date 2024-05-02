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


app.post("/checkout", (req, res) => {
  const {
    firstName,
    lastName,
    streetAddress,
    phone,
    wilaya,
    commune,
    orderNotes,
    deliveryOption,
    paymentMethod,
    cart,
    deliveryCost,
    totalOrderPrice, // Ensure totalOrderPrice is included in the destructuring of req.body
  } = req.body;

  // Verify that totalOrderPrice is defined and valid
  if (typeof totalOrderPrice !== 'number' || isNaN(totalOrderPrice)) {
    return res.status(400).send("Invalid total order price.");
  }

  // Insert order information into the Orders table
  const orderQuery = "INSERT INTO Orders (nom, prenom, address, numTele, wilaya, commune, note, typeLivraison, versement, totalOrderPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(orderQuery, [lastName, firstName, streetAddress, phone, wilaya, commune, orderNotes, deliveryOption, deliveryCost, totalOrderPrice], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error processing order. Please try again.");
    } else {
      // Insert order line items into the OrderLine table
      const orderId = result.insertId;
      const orderLineValues = cart.map(product => [orderId, product.idProduit, product.quantity, product.totalPrice]);
      const orderLineQuery = "INSERT INTO OrderLine (idOrder, idProduit, quantity, totalPrice) VALUES ?";
      db.query(orderLineQuery, [orderLineValues], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error processing order. Please try again.");
        } else {
          return res.status(200).send("Order successfully processed.");
        }
      });
    }
  });
});


// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
