const express = require('express');
const app = express();
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

// Définition de la route pour la racine
app.get('/', (req, res) => {
  // Répondez avec une réponse appropriée, comme une page d'accueil ou un message de bienvenue
  res.send("Welcome to the backend server!");
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

      // Comparer le mot de passe
      if (user.password === password) {
        // Si les informations d'identification sont valides, retourner un message de succès et rediriger vers /promotion
        res.status(200).json({ success: true, message: 'Login successful', userType: 'user' });
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

        // Comparer le mot de passe
        if (admin.password === password) {
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

// Endpoint pour vérifier le statut de blocage de l'utilisateur
// Assurez-vous d'initialiser votre système de gestion de sessions avant de définir vos routes
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


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//  routeur   formulaire produit
// Configuration de Multer pour le téléchargement des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille de fichier à 5 Mo
  fileFilter: (req, file, cb) => {
    // Filtre pour autoriser uniquement les images
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
    cb(null, true);
  },
});


// Middleware pour parser les données du formulaire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route pour ajouter un nouveau produit
app.post('/produits', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 },
]), (req, res) => {
  const {
    name,
    namecategorie,
    namesubcategorie,
    namesubsubcategorie,
    brand,
    price,
    reference,
    description,
  } = req.body;

  let sql;
  let values;
  if (namesubsubcategorie) {
    sql = `
      INSERT INTO produits
      (name, namecategorie, namesubcategorie, namesubsubcategorie, brand, price, reference, description, image_path1, image_path2, image_path3, image_path4, image_path5)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      name,
      namecategorie,
      namesubcategorie,
      namesubsubcategorie,
      brand,
      price,
      reference,
      description,
      req.files.image1?.[0]?.filename || null,
      req.files.image2?.[0]?.filename || null,
      req.files.image3?.[0]?.filename || null,
      req.files.image4?.[0]?.filename || null,
      req.files.image5?.[0]?.filename || null,
    ];
  } else {
    sql = `
      INSERT INTO produits
      (name, namecategorie, namesubcategorie, brand, price, reference, description, image_path1, image_path2, image_path3, image_path4, image_path5)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      name,
      namecategorie,
      namesubcategorie,
      brand,
      price,
      reference,
      description,
      req.files.image1?.[0]?.filename || null,
      req.files.image2?.[0]?.filename || null,
      req.files.image3?.[0]?.filename || null,
      req.files.image4?.[0]?.filename || null,
      req.files.image5?.[0]?.filename || null,
    ];
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du produit :', err);
      res.status(500).json({ error: 'Erreur lors de l\'ajout du produit' });
      return;
    }

    res.status(201).json({ id: result.insertId, imageUrls: [
      `/uploads/${req.files.image1?.[0]?.filename}`,
      `/uploads/${req.files.image2?.[0]?.filename}`,
      `/uploads/${req.files.image3?.[0]?.filename}`,
      `/uploads/${req.files.image4?.[0]?.filename}`,
      `/uploads/${req.files.image5?.[0]?.filename}`,
    ] });
  });
});



// Route pour récupérer les données des produits pour l'admin
app.get('/produits', (req, res) => {
  const query = 'SELECT idProduit, name, namecategorie, namesubcategorie, namesubsubcategorie, brand, price, reference, image_path1 FROM produits';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }

    // Construire les URLs des images
    const produits = results.map((produit) => ({
      ...produit,
      imageUrl: produit.image_path1 ? `http://localhost:3002/uploads/${produit.image_path1}` : null,
    }));

    res.json(produits);
  });
});



//recupere les données de la  base pour le formullaire produit:
//formullaire produit
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

// Route pour gérer les requêtes GET à '/categories/:name/subcategories/:subname/subsubcategories'
app.get('/categories/:name/subcategories/:subname/subsubcategories', (req, res) => {
  const categoryName = req.params.name; // Nom de la catégorie
  const subCategoryName = req.params.subname; // Nom de la sous-catégorie
  const sql = 'SELECT idSubSubCategorie, namesubsubcategorie FROM subsubcategorie WHERE namecategorie = ? AND namesubcategorie = ?';
  db.query(sql, [categoryName, subCategoryName], (error, results) => {
    if (error) {
      console.error('Error fetching subsubcategories:', error);
      res.status(500).json({ error: 'An error occurred while fetching subsubcategories' });
    } else {
      console.log('Subsubcategories fetched:', results);
      res.status(200).json(results);
    }
  });
});
//fin

// Route pour ajouter une subsubcategorie
app.post('/subsubcategories', (req, res) => {
  const { namecategorie, namesubcategorie, namesubsubcategorie } = req.body;
  const sql = 'INSERT INTO subsubcategorie (namecategorie, namesubcategorie, namesubsubcategorie) VALUES (?, ?, ?)';
  db.query(sql, [namecategorie, namesubcategorie, namesubsubcategorie], (error, result) => {
    if (error) {
      console.error('Error adding subsubcategorie:', error);
      res.status(500).json({ error: 'An error occurred while adding subsubcategorie' });
    } else {
      console.log('Subsubcategorie added successfully');
      res.status(201).json({ message: 'Subsubcategorie added successfully', subsubcategorieId: result.insertId });
    }
  });
});


// Middleware pour parser les données du formulaire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route pour récupérer les informations d'un produit
app.get('/produits/:idProduit', (req, res) => {
  const idProduit = req.params.idProduit;
  const query = `
    SELECT
      idProduit,
      name,
      namecategorie,
      namesubcategorie,
      namesubsubcategorie,
      brand,
      price,
      reference,
      description,
      image_path1,
      image_path2,
      image_path3,
      image_path4,
      image_path5
    FROM produits
    WHERE idProduit = ?
  `;

  db.query(query, [idProduit], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération du produit :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: 'Produit non trouvé' });
      return;
    }

    const product = result[0];
    const imageUrls = [
      product.image_path1 ? `/uploads/${product.image_path1}` : null,
      product.image_path2 ? `/uploads/${product.image_path2}` : null,
      product.image_path3 ? `/uploads/${product.image_path3}` : null,
      product.image_path4 ? `/uploads/${product.image_path4}` : null,
      product.image_path5 ? `/uploads/${product.image_path5}` : null,
    ];

    res.json({
      ...product,
      imageUrls,
    });
  });
});

app.put('/produits/:idProduit', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 },
]), async (req, res) => {
  const idProduit = req.params.idProduit;
  const {
    name,
    namecategorie,
    namesubcategorie,
    namesubsubcategorie,
    brand,
    price,
    reference,
    description,
  } = req.body;

  try {
    // Vérifier l'existence de la catégorie
    const categoryExistsQuery = 'SELECT COUNT(*) as count FROM categorie WHERE namecategorie = ?';
    const [categoryResult] = await new Promise((resolve, reject) => {
      connection.query(categoryExistsQuery, [namecategorie], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (categoryResult.count === 0) {
      res.status(400).json({ error: 'Catégorie inexistante' });
      return;
    }

    // Vérifier l'existence de la sous-catégorie
    const subcategoryExistsQuery = 'SELECT COUNT(*) as count FROM subcategorie WHERE namecategorie = ? AND namesubcategorie = ?';
    const [subcategoryResult] = await new Promise((resolve, reject) => {
      connection.query(subcategoryExistsQuery, [namecategorie, namesubcategorie], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (subcategoryResult.count === 0) {
      res.status(400).json({ error: 'Sous-catégorie inexistante' });
      return;
    }

    // Vérifier l'existence de la sous-sous-catégorie
    const subsubcategoryExistsQuery = 'SELECT COUNT(*) as count FROM subsubcategorie WHERE namecategorie = ? AND namesubcategorie = ? AND namesubsubcategorie = ?';
    const [subsubcategoryResult] = await new Promise((resolve, reject) => {
      connection.query(subsubcategoryExistsQuery, [namecategorie, namesubcategorie, namesubsubcategorie], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (subsubcategoryResult.count === 0) {
      res.status(400).json({ error: 'Sous-sous-catégorie inexistante' });
      return;
    }

    // Mettre à jour les données du produit dans la base de données
    const sql = `
      UPDATE produits
      SET name = ?, namecategorie = ?, namesubcategorie = ?, namesubsubcategorie = ?,
          brand = ?, price = ?, reference = ?, description = ?,
          image_path1 = ?, image_path2 = ?, image_path3 = ?, image_path4 = ?, image_path5 = ?
      WHERE idProduit = ?
    `;

    const values = [
      name,
      namecategorie,
      namesubcategorie,
      namesubsubcategorie,
      brand,
      price,
      reference,
      description,
      req.files.image1?.[0]?.filename || null,
      req.files.image2?.[0]?.filename || null,
      req.files.image3?.[0]?.filename || null,
      req.files.image4?.[0]?.filename || null,
      req.files.image5?.[0]?.filename || null,
      idProduit,
    ];

    await new Promise((resolve, reject) => {
      connection.query(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    res.json({ message: 'Produit mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit :', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
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
  const query = "SELECT  rd.idDemande, u.nom, u.prenom, u.email,u.adresse, u.numero_telephone, rd.nom_entreprise, rd.business_registration, rd.tax_identification_number, rd.tax_article, rd.registration_number, rd.statut FROM utilisateur u JOIN revendeur_demande rd ON u.idUtilisateur = rd.idUtilisateur WHERE u.type = 'revendeur'";

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
// Endpoint pour supprimer une demande de compte utilisateur
app.delete('/account/:id', (req, res) => {
  const idDemande = req.params.id;
  const sql = 'DELETE FROM revendeur_demande WHERE idDemande = ?';
  db.query(sql, [idDemande], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de la demande de compte utilisateur :', err);
      res.status(500).send('Erreur lors de la suppression de la demande de compte utilisateur');
      return;
    }
    res.send('Demande de compte utilisateur supprimée avec succès');
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
// liste bloquer
app.get('/listebloques', (req, res) => {
  const query = 'SELECT idUtilisateur, nom, prenom, email, type, blocked FROM utilisateur where blocked = 1';

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

app.delete('/categories/:idCategorie', (req, res) => {
  const idCategorie = req.params.idCategorie;

  // Supprimer les sous-catégories associées à la catégorie
  const deleteSubcategoriesQuery = 'DELETE FROM subcategorie WHERE namecategorie = ?';

  db.query(deleteSubcategoriesQuery, [idCategorie], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression des sous-catégories :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression des sous-catégories' });
      return;
    }

    // Maintenant que les sous-catégories sont supprimées, supprimez la catégorie elle-même
    const deleteCategoryQuery = 'DELETE FROM categorie WHERE idCategorie = ?';

    db.query(deleteCategoryQuery, [idCategorie], (err, result) => {
      if (err) {
        console.error('Erreur lors de la suppression de la catégorie :', err);
        res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie' });
        return;
      }

      res.json({ message: 'Catégorie et ses sous-catégories supprimées avec succès' });
    });
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

// Route handler to delete a product
app.delete('/subcategories/:idSubCategorie', (req, res) => {
  const idSubCategorie = req.params.idSubCategorie; // Utilisez req.params.idProduit pour obtenir l'ID du produit

  // Perform a DELETE operation in the database
  const query = 'DELETE FROM subcategorie WHERE idSubCategorie = ?';

  db.query(query, [idSubCategorie], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression du subcategorie :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression du subcategorie' });
      return;
    }

    res.json({ message: 'subcategorie supprimé avec succès' });
  });
});

// Route handler to delete a demande
app.delete('/account/:idDemande`', (req, res) => {
  const idDemande = req.params['idDemande`'];

  // Perform a DELETE operation in the database
  const query = 'DELETE FROM revendeur_demande WHERE idDemande = ?';

  db.query(query, [idDemande], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de la demande :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression de la demande' });
      return;
    }

    res.json({ message: 'demande supprimé avec succès' });
  });
});

// retour pour les  SUB sous categories
app.get('/subsubcategories', (req, res) => {
  const query = "SELECT idSubSubCategorie, namecategorie, nameSubCategorie, namesubsubcategorie FROM subsubcategorie";

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }

    res.json(results); // Return the retrieved data in JSON format
  });
});

// Route handler to delete a subsubbcategorie
app.delete('/subsubcategories/:idSubSubCategorie', (req, res) => {
  const idSubSubCategorie = req.params.idSubSubCategorie; 

  // Perform a DELETE operation in the database
  const query = 'DELETE FROM subsubcategorie WHERE idSubSubCategorie = ?';

  db.query(query, [idSubSubCategorie], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression du subsubcategorie :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression du subsubcategorie' });
      return;
    }

    res.json({ message: 'subcategorie supprimé avec succès' });
  });
});



// Route pour récupérer tous les utilisateurs
app.get('/utilisateurs/:id', (req, res) => {
  const sql = 'SELECT * FROM utilisateur WHERE idUtilisateur  = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).send('Erreur lors de la récupération des données');
      return;
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(result);
  });
});

// insertion des données de categorie formullaire categorie
app.post('/categories', (req, res) => {
  const { namecategorie } = req.body;
  const sql = 'INSERT INTO categorie (namecategorie) VALUES (?)';
  db.query(sql, [namecategorie], (err, result) => {
    if (err) {
      console.error('Error adding category:', err);
      res.status(500).send('Error adding category');
      return;
    }
    res.status(201).send('Category added');
  });
});

app.post('/subcategories', (req, res) => {
  const { categoryName, namesubcategorie } = req.body; 

  const sql = 'INSERT INTO subcategorie (namecategorie, namesubcategorie) VALUES (?, ?)';
  db.query(sql, [categoryName, namesubcategorie], (err, result) => { 
    if (err) {
      console.error('Error adding subcategory:', err);
      res.status(500).send('Error adding subcategory');
      return;
    }
    res.status(201).send('Subcategory added');
  });
});


app.post('/subsubcategories', (req, res) => {
  const { namecategorie, namesubcategorie, namesubsubcategorie } = req.body;

  // Insérez directement la sous-sous-catégorie dans la base de données sans la découper
  const sqlInsert = 'INSERT INTO subsubcategorie (namecategorie, namesubcategorie, namesubsubcategorie) VALUES (?, ?, ?)';
  db.query(sqlInsert, [namecategorie, namesubcategorie, namesubsubcategorie], (err, result) => {
    if (err) {
      console.error('Error adding subsubcategorie:', err);
      res.status(500).send('Error adding subsubcategorie');
      return;
    }
    res.status(201).send('Subsubcategorie added successfully');
  });
});



  
//recuperer les produit pour les selctionners pour une promotions
app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM produits';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits:', err);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.json(result);
  });
});
//recuperer les promotions de la table 
app.get('/promotions', (req, res) => {
  const sql = 'SELECT * FROM promotions';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des promotions:', err);
      res.status(500).send('Erreur lors de la récupération des promotions');
      return;
    }
    res.json(result);
  });
});

// Route pour récupérer le nom d'un produit à partir de son nom
app.get('/product/:name', (req, res) => {
  const productName = req.params.name;
  const sql = 'SELECT idProduit FROM produits WHERE name = ?'; // Récupérez l'ID du produit par son nom
  db.query(sql, [productName], (err, result) => {
      if (err) {
          console.error('Erreur lors de la récupération du nom du produit:', err);
          res.status(500).send('Erreur lors de la récupération du nom du produit');
          return;
      }
      if (result.length === 0) {
          res.status(404).send('Produit non trouvé');
          return;
      }
      const productId = result[0].idProduit;
      res.json(productId); // Renvoyer l'ID du produit
  });
});

// Route pour insérer une nouvelle promotion
app.post('/add-promotion', (req, res) => {
  const promotionDetails = req.body;
  const { Produit, PrixNormal, PrixPromotion, Reduction, DateFinPromotion } = promotionDetails;
  const sql = 'INSERT INTO promotions (Produit, PrixNormal, PrixPromotion, Reduction, DateFinPromotion) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [Produit, PrixNormal, PrixPromotion, Reduction, DateFinPromotion], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de la promotion:', err);
      res.status(500).send('Erreur lors de l\'insertion de la promotion');
      return;
    }
    console.log('Promotion ajoutée avec succès');
    res.status(200).send('Promotion added successfully');
  });
});


//supprimer une promotion 
app.delete('/promotions/:id', (req, res) => {
  const promotionId = req.params.id;
  const sql = 'DELETE FROM promotions WHERE idPromotion = ?';
  db.query(sql, [promotionId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de la promotion:', err);
      res.status(500).send('Erreur lors de la suppression de la promotion');
      return;
    }
    res.send('Promotion supprimée avec succès');
  });
});



// Route pour récupérer les informations d'un utilisateur par son ID
app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log('Requête pour l\'utilisateur avec l\'ID :', userId);

  const query = `SELECT * FROM utilisateur WHERE idUtilisateur = ?`;

  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Erreur lors de la récupération des données de l\'utilisateur :', err);
          res.status(500).json({ message: 'Erreur lors de la récupération des données de l\'utilisateur' });
          return;
      }

      if (results.length === 0) {
          res.status(404).json({ message: 'Utilisateur non trouvé' });
          return;
      }

      // Si l'utilisateur est trouvé, renvoyer les informations de l'utilisateur
      res.json(results[0]);
  });
});
app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log('Requête pour l\'utilisateur avec l\'ID :', userId);

  const query = `SELECT blocked FROM utilisateur WHERE idUtilisateur = ?`;

  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Erreur lors de la récupération des données de l\'utilisateur :', err);
          res.status(500).json({ message: 'Erreur lors de la récupération des données de l\'utilisateur' });
          return;
      }

      if (results.length === 0) {
          res.status(404).json({ message: 'Utilisateur non trouvé' });
          return;
      }

      // Récupération du statut de blocage de l'utilisateur
      const blocked = results[0].blocked === 1;

      // Retourner les informations de l'utilisateur ainsi que son statut de blocage
      res.json({ user: results[0], blocked: blocked });
  });
});



//FORMULLAIRE DE LA SUB CATEGORIE 
// Créer une route pour gérer l'ajout de sous-catégorie
app.post('/subcategorie', (req, res) => {
  const { namecategorie , namesubcategorie } = req.body;
  const sql = 'INSERT INTO subcategorie (namecategorie , namesubcategorie) VALUES (?, ?)';
  db.query(sql, [namecategorie , namesubcategorie], (err, result) => {
    if (err) {
      res.status(500).send("Erreur lors de l'insertion de la sous-catégorie dans la base de données");
    } else {
      res.status(200).send("Sous-catégorie insérée avec succès");
    }
  });
});

// Créer une route pour gérer l'ajout de sous-sous-catégorie
app.post('/subsubcategorie', (req, res) => {
  const { namecategorie, namesubcategorie, namesubsubcategorie } = req.body;
  const sql = 'INSERT INTO subsubcategorie (namecategorie, nameSubCategorie, namesubsubcategorie) VALUES (?, ?, ?)';
  db.query(sql, [namecategorie, namesubcategorie, namesubsubcategorie], (err, result) => {
    if (err) {
      res.status(500).send("Erreur lors de l'insertion de la sous-sous-catégorie dans la base de données");
    } else {
      res.status(200).send("Sous-sous-catégorie insérée avec succès");
    }
  });
});


//FORMULLAIRE DE LA SUB SUB CATEGORIE 
// Route pour récupérer toutes les catégories depuis la base de données
app.get('/categories', (req, res) => {
  const sql = 'SELECT * FROM categorie';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des catégories depuis la base de données:', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des catégories depuis la base de données' });
      return;
    }
    res.json(results);
  });
});

// Route pour récupérer les sous-catégories en fonction du nom de la catégorie
app.get('/categories/:categoryName/subcategories', (req, res) => {
  const categoryName = req.params.categoryName;
  const sql = 'SELECT * FROM subcategorie WHERE namecategorie = ?'; // Utilisation du nom de catégorie
  db.query(sql, [categoryName], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des sous-catégories depuis la base de données:', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des sous-catégories depuis la base de données' });
      return;
    }
    res.json(results);
  });
});

// Route pour insérer une sous-sous-catégorie dans la base de données
app.post('/subsubcategories', (req, res) => {
  const { idSubSubCategorie, namesubcategorie, namecategorie, namesubsubcategorie } = req.body;
  const sql = 'INSERT INTO subsubcategorie (idSubSubCategorie, namesubcategorie, namecategorie, namesubsubcategorie) VALUES (?, ?, ?, ?)';
  db.query(sql, [idSubSubCategorie, namesubcategorie, namecategorie, namesubsubcategorie], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de la sous-sous-catégorie dans la base de données:', err);
      res.status(500).json({ error: 'Erreur lors de l\'insertion de la sous-sous-catégorie dans la base de données' });
      return;
    }
    res.status(201).json({ message: 'Sous-sous-catégorie insérée avec succès', id: result.insertId });
  });
});

//bloquer et debloquer un user 
// Contrôleur pour bloquer un utilisateur
app.put('/users/:userId/block', (req, res) => {
  const userId = req.params.userId;
  const sql = 'UPDATE utilisateur SET blocked = 1 WHERE idUtilisateur = ?';
  db.query(sql, userId, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Erreur lors du blocage de l\'utilisateur' });
    } else {
      res.json({ message: 'L\'utilisateur a été bloqué' });
    }
  });
});

// Contrôleur pour débloquer un utilisateur
app.put('/users/:userId/unblock', (req, res) => {
  const userId = req.params.userId;
  const sql = 'UPDATE utilisateur SET blocked = 0 WHERE idUtilisateur = ?';
  db.query(sql, userId, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Erreur lors du déblocage de l\'utilisateur' });
    } else {
      res.json({ message: 'L\'utilisateur a été débloqué' });
    }
  });
});

app.get('/revendeur/:idDemande', (req, res) => {
  const revendeurId = req.params.idDemande;
  const query = `
    SELECT * 
    FROM revendeur_demande 
    WHERE idDemande = ?;
  `;

  db.query(query, [revendeurId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données de la demande de revendeur :', err);
      res.status(500).json({ message: 'Erreur lors de la récupération des données de la demande de revendeur' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Demande de revendeur non trouvée' });
      return;
    }

    // Si la demande de revendeur est trouvée, renvoyer les informations
    res.json(results[0]);
  });
});


// Endpoint pour valider une demande de revendeur
// Endpoint pour valider une demande de revendeur
app.post('/validate/:idDemande', (req, res) => {
  const demandeId = req.params.idDemande;
  const updateQuery = `
    UPDATE revendeur_demande 
    SET statut = 'approuvée' 
    WHERE idDemande = ?;
  `;
  db.query(updateQuery, [demandeId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la validation de la demande :', err);
      res.status(500).json({ message: 'Erreur lors de la validation de la demande' });
      return;
    }
    res.json({ message: 'Demande validée avec succès' });
  });
});

// Endpoint pour supprimer une demande de revendeur
app.delete('/delete/:idDemande', (req, res) => {
  const demandeId = req.params.idDemande;
  const deleteQuery = `
    DELETE FROM revendeur_demande 
    WHERE idDemande = ?;
  `;
  db.query(deleteQuery, [demandeId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de la demande :', err);
      res.status(500).json({ message: 'Erreur lors de la suppression de la demande' });
      return;
    }
    res.json({ message: 'Demande supprimée avec succès' });
  });
});

// liste admin
app.get('/admin', (req, res) => {
  const query = 'SELECT * FROM admin';

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

// Endpoint pour gérer la déconnexion
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy session:', err);
      res.status(500).send('Failed to logout');
    } else {
      res.clearCookie('sessionId'); // Suppression du cookie de session (remplacez 'sessionId' par le nom de votre cookie)
      res.sendStatus(200); // Envoyer une réponse réussie
    }
  });
});




app.get('/orders', (req, res) => {
  const query = `
  SELECT 
    o.idOrder,
    GROUP_CONCAT(p.name) AS products,
    o.status,
    o.typeLivraison,
    o.totalOrderPrice,
    o.date
  FROM 
    Orders o
  INNER JOIN 
    OrderLine ol ON o.idOrder = ol.idOrder
  INNER JOIN 
    produits p ON ol.idProduit = p.idProduit
  GROUP BY 
    o.idOrder;
  `;

  // Utiliser l'objet 'db' pour exécuter la requête au lieu de 'connection'
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }

    res.json(results); // Retourner les données récupérées au format JSON
  });
});





// Route pour récupérer les détails d'une commande par son ID
app.get('/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const query = `
    SELECT o.nom, o.prenom, o.address, o.numTele, o.note, o.typeLivraison, o.versement, o.date, o.status, o.totalOrderPrice, ol.quantity, ol.totalPrice, ol.name AS nomProduit
    FROM orders o
    INNER JOIN orderline ol ON o.idOrder = ol.idOrder
    WHERE o.idOrder = ?;
  `;

  db.query(query, [orderId], (error, results) => {
    if (error) {
      console.error('Erreur lors de l\'exécution de la requête SQL :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    } else {
      if (results.length > 0) {
        // Récupérer les détails de la commande
        const orderDetails = {
          idOrder: orderId,
          nom: results[0].nom,
          prenom: results[0].prenom,
          address: results[0].address,
          numTele: results[0].numTele,
          note: results[0].note,
          typeLivraison: results[0].typeLivraison,
          versement: results[0].versement,
          date: results[0].date,
          status: results[0].status,
          totalOrderPrice: results[0].totalOrderPrice,
          products: results.map(row => ({
            name: row.nomProduit,
            quantity: row.quantity,
            totalPrice: row.totalPrice
          }))
        };
        res.json(orderDetails); // Renvoie les détails de la commande avec les produits associés
      } else {
        res.status(404).json({ error: 'Commande non trouvée.' });
      }
    }
  });
});

app.use(bodyParser.json());

// Mettre à jour le statut de la commande pour l'affecter
app.put('/orders/:orderId/affect', (req, res) => {
  const { orderId } = req.params;
  const query = `UPDATE orders SET status = 'confirmed' WHERE idOrder = ?`;

  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'affectation de la commande :', err);
      res.status(500).json({ error: 'Erreur lors de l\'affectation de la commande' });
      return;
    }

    res.json({ message: 'La commande a été affectée avec succès' });
  });
});


// Supprimer une commande
app.put('/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const query = `UPDATE orders SET status = 'processing' WHERE idOrder = ?`;

  db.query(query, [status, orderId], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'affectation de la commande :', err);
      res.status(500).json({ error: 'Erreur lors de l\'affectation de la commande' });
      return;
    }

    res.json({ message: 'La commande a été affectée avec succès' });
  });
});