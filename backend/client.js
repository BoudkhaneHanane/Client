const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create Express app
const app = express();

// Create database connection
const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '', 
  database: 'chinformatiquebdd',
});


// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('uploads'));
app.use(morgan('dev')); // Utilisez morgan pour enregistrer les logs des requêtes HTTP
app.use(bodyParser.json());
app.use(session({
  secret: 'secret', // Clé secrète pour signer les cookies de session
  resave: false,
  saveUninitialized: false
}));


// Vérification de la connexion à la base de données
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});
// Define a route to fetch products based on selected component
app.get("/listbuild/:selectedComponent", (req, res) => {
  const { selectedComponent } = req.params;
  const { selectedProcessor } = req.query; // Extract selectedProcessor from query params
  let sql;
  
  // Handle the condition for CPU selection
  if (selectedComponent === "CPU") {
    // Determine the appropriate subsubcategorie based on selectedProcessor
    const subsubcategorie = selectedProcessor === "AMD" ? "AMD CPUs" : "Intel CPUs";
    sql = "SELECT * FROM produits WHERE namesubcategorie = 'CPU Processors' AND namesubsubcategorie = ?";
  } else if (selectedComponent === "Motherboard") {
    // Adjust the query to filter by both namesubcategorie and namesubsubcategorie
    sql = "SELECT * FROM produits WHERE namesubcategorie = 'Motherboards' AND namesubsubcategorie = ?";
  } else {
    sql = "SELECT * FROM produits WHERE namesubcategorie = ?";
  }

  db.query(sql, [selectedComponent], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

















//login
app.post('/login', (req, res) => {
  console.log('Login route hit');
  // Récupérer les données d'identification de la requête
  const { email, password } = req.body;

  // Requête SQL pour récupérer l'utilisateur à partir de l'email dans la table 'utilisateur'
  const getUserSql = 'SELECT * FROM utilisateur WHERE email = ?';
  // Requête SQL pour récupérer l'admin à partir de l'email dans la table 'admin'
  const getAdminSql = 'SELECT * FROM admin WHERE email = ?';

  db.query(getUserSql, [email], async (err, userResults) => {
    if (err) {
      console.error('Error retrieving user:', err);
      res.status(500).send('Error retrieving user');
      return;
    }
  
    // Vérifier si l'utilisateur existe dans la table 'utilisateur'
    if (userResults.length > 0) {
      const user = userResults[0];
  
      // Comparer le mot de passe haché
      if (await bcrypt.compare(password, user.mot_de_passe)) {
        // Si les informations d'identification sont valides, retourner un message de succès et rediriger vers /promotion
        res.status(200).json({
          success: true,
          message: 'Login successful',
          userType: 'user',
          nom: user.nom,
          prenom: user.prenom
        });
        return;
      }
    }
    // Si l'utilisateur n'est pas trouvé dans la table 'utilisateur', vérifier dans la table 'admin'
    db.query(getAdminSql, [email], async (err, adminResults) => {
      if (err) {
        console.error('Error retrieving admin:', err);
        res.status(500).send('Error retrieving admin');
        return;
      }

      // Vérifier si l'admin existe dans la table 'admin'
      if (adminResults.length > 0) {
        const admin = adminResults[0];

        // Comparer le mot de passe haché
        if (await bcrypt.compare(password, admin.password)) {
          // Si les informations d'identification sont valides, rediriger vers /adminhome
          res.status(200).json({ success: true, message: 'Login successful', userType: 'admin' });
          return;
        }
      }

      // Si ni l'utilisateur ni l'admin n'ont été trouvés
      res.status(401).send('Invalid email or password');
    });
  });
});
// Endpoint pour vérifier si l'email existe
app.get('/checkEmail', (req, res) => {
  const email = req.query.email;

  // Requête SQL pour vérifier si l'email existe déjà dans la base de données
  const checkEmailSql = 'SELECT COUNT(*) AS count FROM utilisateur WHERE email = ?';

  db.query(checkEmailSql, [email], (err, result) => {
    if (err) {
      console.error('Error checking email:', err);
      res.status(500).send('Error checking email');
      return;
    }

    const emailExists = result[0].count > 0;
    res.json({ exists: emailExists });
  });
});
// Route pour enregistrer l'utilisateur
app.post('/utilisateur', async (req, res) => {
  const formData = req.body;

  // Check if formData contains password
  if (!formData.password) {
    return res.status(400).send('Password is required');
  }

  try {
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Requête SQL pour insérer les données de l'utilisateur dans la table "utilisateur"
    const userSql = 'INSERT INTO utilisateur (nom, prenom, adresse, numero_telephone, email, Date_anniversaire, mot_de_passe, date_creation, date_derniere_connexion, type) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)';

    db.query(userSql, [formData.nom, formData.prenom, formData.adresse, formData.numero_telephone, formData.email, formData.Date_anniversaire, hashedPassword, formData.type], (err, result) => {
      if (err) {
        console.error('Error creating user:', err);
        return res.status(500).send('Error creating user');
      }

      // Si l'utilisateur est enregistré en tant que revendeur, enregistrer les détails supplémentaires dans la table revendeur_demande
      if (formData.type === 'Revendeur') {
        const revendeurSql = 'INSERT INTO revendeur_demande (idUtilisateur, nom_entreprise, business_registration, tax_identification_number, tax_article, registration_number, statut) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(revendeurSql, [result.insertId, formData.companyName, formData.businessRegistration, formData.taxIdentificationNumber, formData.taxArticle, formData.registrationNumber, 'en attente'], (err) => {
          if (err) {
            console.error('Error creating revendeur demande:', err);
            return res.status(500).send('Error creating revendeur demande');
          }
          // Rediriger le revendeur vers la page Profile Page
          res.status(200).send('Votre demande sera traitée et contactée.');
        });
      } else {
        // Rediriger le client vers la page Profile Page
        res.status(200).send('Vous êtes inscrit avec succès.');
      }
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).send('Error hashing password');
  }
});

app.use(express.json()); // Middleware pour parser le corps de la requête en JSON

// Définissez vos routes après avoir configuré la gestion de session
app.get('/users/checkBlockedStatus', (req, res) => {
  // Assurez-vous que l'utilisateur est authentifié avant d'accéder à cette route
  if (!req.session.userId) {
    return res.status(401).json({ message: 'User is not authenticated' });
  }

  const userId = req.session.userId; // Récupérez l'ID de l'utilisateur à partir de la session

  // Requête SQL pour récupérer le statut de blocage de l'utilisateur à partir de son ID
  const query = 'SELECT blocked FROM utilisateur WHERE idUtilisateur = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération du statut de blocage de l\'utilisateur :', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération du statut de blocage de l\'utilisateur' });
    }

    // Vérifiez si l'utilisateur est bloqué ou non
    const blocked = result[0].blocked === 1 ? true : false;

    // Retournez le statut de blocage de l'utilisateur
    res.json({ blocked });
  });
});
// Vérifie si l'e-mail existe dans la base de données
app.post('/check-email', (req, res) => {
  const { email } = req.body;
  const query = 'SELECT * FROM utilisateur WHERE email = ?';

  db.query(query, [email], (error, results) => {
    if (error) {
      console.error('Erreur de base de données:', error);
      res.status(500).json({ exists: false, message: 'Erreur de base de données' });
      return;
    }

    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});
// Réinitialise le mot de passe de l'utilisateur de manière hachée
app.post('/forgot-password', (req, res) => {
  const { email, newPassword } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error('Error generating salt:', err);
      return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la réinitialisation du mot de passe.' });
    }

    console.log('Generated salt:', salt); // Log for debugging

    bcrypt.hash(newPassword, salt, async (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la réinitialisation du mot de passe.' });
      }

      console.log('Hashed password:', hashedPassword); // Log for debugging

      const query = 'UPDATE utilisateur SET mot_de_passe = ? WHERE email = ?';
      db.query(query, [hashedPassword, email], (error, results) => {
        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ success: false, message: 'Erreur de base de données' });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }
        res.json({ success: true, message: 'Mot de passe réinitialisé avec succès.' });
      });
    });
  });
});
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
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/shop", (req, res) => {
  const sqlQuery = `
  SELECT p.*, pr.prixPromo, pr.reduction, pr.dateFinPromo
  FROM produits p
  LEFT JOIN promotions pr ON p.idProduit = pr.idProduit;  
`;
db.query(sqlQuery, (err, result) => {
  if (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  } else {
    console.log(result); // Print the result to check the structure and values
    res.send(result);
  }
});
});
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
// Route for fetching orders based on user's nom and prenom
app.get('/orders/:nom/:prenom', (req, res) => {
  const { nom, prenom } = req.params;

  // Query to fetch orders based on nom and prenom
  const getOrdersQuery = `
    SELECT *
    FROM Orders
    WHERE nom = ? AND prenom = ?
  `;

  db.query(getOrdersQuery, [nom, prenom], (err, orders) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).send('Error fetching orders');
    }

    res.json(orders);
  });
});
// Route for fetching order details and order information based on order ID
app.get('/orderdetails/:orderId', (req, res) => {
  const orderId = req.params.orderId;

  // Query to fetch order details and order information based on order ID
  const getOrderDetailsQuery = `
    SELECT o.*, ol.*
    FROM Orders o
    INNER JOIN OrderLine ol ON o.idOrder = ol.idOrder
    WHERE o.idOrder = ?
  `;

  db.query(getOrderDetailsQuery, [orderId], (err, orderDetails) => {
    if (err) {
      console.error('Error fetching order details:', err);
      return res.status(500).send('Error fetching order details');
    }

    res.json(orderDetails);
  });
});
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});