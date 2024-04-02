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
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Assurez-vous que le chemin est correct
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });

// Route to handle POST requests to '/produits'
app.post('/produits', upload.single('image'), (req, res) => {
  const { name, namecategorie, namesubcategorie, brand, price, reference, description } = req.body;
  const imagePath = req.file ? req.file.path : null; // Get the path of the uploaded image
  console.log("Image path:", imagePath); // Add a log to check the path of the uploaded image

  // Insert product data into the database, including the image path
  const sql = 'INSERT INTO produits (name, namecategorie, namesubcategorie, brand, price, reference, description, image_path1) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, namecategorie, namesubcategorie, brand, price, reference, description, imagePath], (error, result) => {
    if (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'An error occurred while creating the product' });
    } else {
      console.log('Product created successfully');
      res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
    }
  });
});

// Route to handle GET requests to '/categories'
app.get('/categories', (req, res) => {
  const sql = 'SELECT * FROM categorie';
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'An error occurred while fetching categories' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Route pour gérer les requêtes GET à '/categories/:name/subcategories'
app.get('/categories/:name/subcategories', (req, res) => {
  const categoryName = req.params.name; // Nom de la catégorie
  const sql = 'SELECT idSubCategorie, 	namesubcategorie FROM subcategorie WHERE namecategorie = ?';
  db.query(sql, [categoryName], (error, results) => {
    if (error) {
      console.error('Error fetching subcategories:', error);
      res.status(500).json({ error: 'An error occurred while fetching subcategories' });
    } else {
      console.log('Subcategories fetched:', results); // Ajouter ce journal pour vérifier les données récupérées
      res.status(200).json(results);
    }
  });
});




// recuperer les données produit pour les afficher à l'admin
app.get('/produits', (req, res) => {
  const query = 'SELECT idProduit, name, namecategorie, namesubcategorie, brand, price, reference, image_path1 FROM produits';

  // Use the 'db' object to execute the query instead of 'connection'
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }

    res.json(results);
  });
});

//recupere les données de la  base pour la formullaire :
// Routes
app.get('/produits/:idProduit', async (req, res) => {
  try {
    const productId = req.params.idProduit;
    const query = 'SELECT idProduit, name, namecategorie, namesubcategorie, brand, price, reference, description, REPLACE(image_path1, "\\\\", "/") AS image_path1 FROM produits WHERE idProduit = ?';
    db.query(query, [productId], (err, result) => {
      if (err) {
        console.error('Erreur lors de la récupération des données du produit :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des données du produit' });
        return;
      }
      if (result.length === 0) {
        res.status(404).json({ error: 'Produit non trouvé' });
        return;
      }
      res.json(result[0]);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//update 
app.put('/produits/:idProduit', async (req, res) => {
  try {
    const idProduit = req.params.idProduit;
    const updatedData = req.body;

    // Vérifier s'il y a des champs modifiés
    const fieldsToUpdate = Object.keys(updatedData);
    if (fieldsToUpdate.length === 0) {
      res.status(400).json({ error: 'Aucun champ à mettre à jour fourni' });
      return;
    }

    // Construire la requête SQL dynamiquement en fonction des champs modifiés
    // Construire la requête SQL dynamiquement en fonction des champs modifiés
let query = 'UPDATE produits SET ';
const values = [];

fieldsToUpdate.forEach((field, index) => {
  if (field !== 'created_at' && field !== 'updated_at') { // Ignorer les champs created_at et updated_at
    if (index > 0) {
      query += ', ';
    }
    query += `${field} = ?`;
    values.push(updatedData[field]);
  }
});

query += ', updated_at = NOW()'; // Utiliser NOW() pour mettre à jour updated_at
query += ' WHERE idProduit = ?';
values.push(idProduit);


    // Effectuer l'opération de mise à jour dans la base de données
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du produit :', err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
        return;
      }

      res.json({ message: 'Produit mis à jour avec succès' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
  const query = "SELECT idCategorie, namecategorie FROM categorie";

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
app.get('/subcategorie', (req, res) => {
  const query = "SELECT idSubCategorie, namecategorie, namesubcategorie FROM subcategorie";

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }

    res.json(results); // Return the retrieved data in JSON format
  });
});




// Middleware pour analyser les corps des requêtes HTTP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route GET pour récupérer toutes les catégories
app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categories';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Error fetching categories' });
      return;
    }

    res.json(results);
  });
});

// Route GET pour récupérer une catégorie par son ID
app.get('/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  const query = 'SELECT * FROM categories WHERE id = ?';

  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error('Error fetching category:', err);
      res.status(500).json({ error: 'Error fetching category' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Route POST pour ajouter une nouvelle catégorie
app.post('/categories', (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO categories (name) VALUES (?)';

  db.query(query, [name], (err, result) => {
    if (err) {
      console.error('Error adding category:', err);
      res.status(500).json({ error: 'Error adding category' });
      return;
    }

    res.status(201).json({ message: 'Category added successfully', id: result.insertId });
  });
});

// Route PUT pour mettre à jour une catégorie existante
app.put('/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  const query = 'UPDATE categories SET name = ? WHERE id = ?';

  db.query(query, [name, categoryId], (err, result) => {
    if (err) {
      console.error('Error updating category:', err);
      res.status(500).json({ error: 'Error updating category' });
      return;
    }

    res.json({ message: 'Category updated successfully' });
  });
});

// Route DELETE pour supprimer une catégorie par son ID
app.delete('/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  const query = 'DELETE FROM categories WHERE id = ?';

  db.query(query, [categoryId], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      res.status(500).json({ error: 'Error deleting category' });
      return;
    }

    res.json({ message: 'Category deleted successfully' });
  });
});


