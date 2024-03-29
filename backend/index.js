const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const morgan = require('morgan'); 
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev')); // Utilisez morgan pour enregistrer les logs des requêtes HTTP
app.use(bodyParser.json());

// Create database connection
const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'chinformatiquebdd', 
});

// Vérification de la connexion à la base de données
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
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







//creation d'un autre routeur pour le login
app.post('/', async (req, res) => {
    console.log('Login route hit');
    // Récupérez les données d'identification de la requête
    const { email, password } = req.body;

    // Requête SQL pour récupérer l'utilisateur à partir de l'email
    const getUserSql = 'SELECT * FROM utilisateur WHERE email = ?';
    
    db.query(getUserSql, [email], async (err, results) => {
        if (err) {
            console.error('Error retrieving user:', err);
            res.status(500).send('Error retrieving user');
            return;
        }

        // Vérifier si l'utilisateur existe
        if (results.length === 0) {
            res.status(401).send('Invalid email or password');
            return;
        }

        // Comparer le mot de passe hashé
        const user = results[0];
        try {
            const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
            if (!isPasswordValid) {
                res.status(401).send('Invalid email or password');
                return;
            }
            // Si les informations d'identification sont valides, retourner un message de succès ou un jeton d'authentification
            res.status(200).json({ success: true, message: 'Login successful' });
        } catch (error) {
            console.error('Error comparing passwords:', error);
            res.status(500).send('Error comparing passwords');
        }
    });
});




// Vérifie si l'e-mail existe dans la base de données
app.post('/check-email', (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM utilisateur WHERE email = ?';
  
    connection.query(query, [email], (error, results) => {
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
        return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la réinitialisation du mot de passe.' });
      }
      
      bcrypt.hash(newPassword, salt, async (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la réinitialisation du mot de passe.' });
        }
  
        const query = 'UPDATE utilisateur SET mot_de_passe = ? WHERE email = ?';
        connection.query(query, [hashedPassword, email], (error) => {
          if (error) {
            return res.status(500).json({ success: false, message: 'Erreur de base de données' });
          }
          res.json({ success: true, message: 'Mot de passe réinitialisé avec succès.' });
        });
      });
    });
  });
  
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


  //  routeur page formulaire produit
// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/'); // Assurez-vous que le chemin est correct
  },
  filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });

// Route to handle POST requests to '/produits'
app.post('/produits', upload.single('image'), (req, res) => {
  const { name, idCategorie, idSubCategorie, brand, price, reference, description } = req.body;
  const imagePath = req.file ? req.file.path : null; // Get the path of the uploaded image
  console.log("Image path:", imagePath); // Add a log to check the path of the uploaded image

  // Insert product data into the database, including the image path
  const sql = 'INSERT INTO produits (name, idCategorie, idSubCategorie, brand, price, reference, description, image_path1) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, idCategorie, idSubCategorie, brand, price, reference, description, imagePath], (error, result) => {
      if (error) {
          console.error('Error creating product:', error);
          res.status(500).json({ error: 'An error occurred while creating the product' });
      } else {
          console.log('Product created successfully');
          res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
      }
  });
});


// Define your route handler for retrieving products
app.get('/produits', (req, res) => {
  const query = 'SELECT idProduit, name, idCategorie, idSubCategorie, brand, price, reference, image_path1, created_at, updated_at FROM produits';

  // Use the 'db' object to execute the query instead of 'connection'
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }

    res.json(results); // Return the retrieved data in JSON format
  });
});


  
// Route handler to delete a product
app.delete('/produits/:idProduit', (req, res) => {
  const idProduit = req.params.idProduit; // Utilisez req.params.idProduit pour obtenir l'ID du produit

  // Perform a DELETE operation in the database
  const query = 'DELETE FROM produits WHERE idProduit = ?';

  db.query(query, [idProduit], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression du produit :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
      return;
    }

    res.json({ message: 'Produit supprimé avec succès' });
  });
});





// Route pour récupérer les informations des demandes de revendeur avec les détails de l'utilisateur

app.get('/account', (req, res) => {
  const query = "SELECT u.nom, u.prenom, u.email, u.numero_telephone, rd.nom_entreprise, rd.business_registration, rd.tax_identification_number, rd.tax_article, rd.registration_number FROM utilisateur u JOIN revendeur_demande rd ON u.idUtilisateur = rd.idUtilisateur WHERE u.type = 'revendeur'";

  // Utilisez l'objet 'db' pour exécuter la requête au lieu de 'connection'
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }

    res.json(results); // Retournez les données récupérées au format JSON
  });
});

// Define your route handler for retrieving users
app.get('/users', (req, res) => {
  const query = 'SELECT idUtilisateur, nom, prenom, email, type FROM utilisateur';

  // Use the 'db' object to execute the query instead of 'connection'
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }

    res.json(results); // Return the retrieved data in JSON format
  });
});

// retour pour les categories
app.get('/categories', (req, res) => {
  const query = "SELECT idCategorie, name FROM categories";

  // Utilisez l'objet 'db' pour exécuter la requête au lieu de 'connection'
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }

    res.json(results); // Retournez les données récupérées au format JSON
  });
});

// retour pour les  sous categories
app.get('//subcategorie', (req, res) => {
  const query = "SELECT idSubCategorie, idCategorie, name FROM subcategories";

  // Utilisez l'objet 'db' pour exécuter la requête au lieu de 'connection'
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }

    res.json(results); // Retournez les données récupérées au format JSON
  });
});