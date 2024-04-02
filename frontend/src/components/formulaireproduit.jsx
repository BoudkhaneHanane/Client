import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './formulaire.css';

const FormulaireProduit = () => {
  const { id } = useParams();
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    namecategorie: '', 
    namesubcategorie: '', 
    brand: '',
    price: '',
    reference: '',
    description: '',
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoriesUpdated, setCategoriesUpdated] = useState(new Date().getTime());

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProductData();
    }
  }, [categoriesUpdated, id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/categories?t=${categoriesUpdated}`, {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      console.log('Categories fetched:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = async (e) => {
    const categoryName = decodeURIComponent(e.target.value);
    console.log('Selected category name:', categoryName);
    setFormData({
      ...formData,
      namecategorie: categoryName, // Modifier pour correspondre au nouveau nom
      namesubcategorie: '', // Assurez-vous de vider également la sous-catégorie sélectionnée
    });
    setCategoriesUpdated(new Date().getTime());
    fetchSubCategories(categoryName);
  };

  const fetchSubCategories = async (categoryName) => {
    try {
      if (!categoryName) {
        return;
      }
      const encodedCategoryName = encodeURIComponent(categoryName); // Encodage du nom de la catégorie
      const response = await axios.get(`http://localhost:3002/categories/${encodedCategoryName}/subcategories`);
      console.log('Subcategories fetched:', response.data); // Ajouter ce journal pour vérifier les données récupérées
      setSubCategories(response.data);
    } catch (error) {
      console.error('Error fetching sub-categories:', error);
    }
  };
  
  const fetchProductData = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/produits/${id}`);
      console.log('Product data fetched:', response.data);
      setFormData(response.data);
      setImageUrl(response.data.imageUrl); // Mettre à jour l'URL de l'image
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };
  

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.reference.trim() === '') {
      console.error('Reference field cannot be empty');
      return;
    }

    const formDataWithImage = new FormData();
    formDataWithImage.append('image', image);
    formDataWithImage.append('name', formData.name);
    formDataWithImage.append('namecategorie', formData.namecategorie);
    formDataWithImage.append('namesubcategorie', formData.namesubcategorie);
    formDataWithImage.append('brand', formData.brand);
    formDataWithImage.append('price', formData.price);
    formDataWithImage.append('reference', formData.reference);
    formDataWithImage.append('description', formData.description);

    try {
      let response;
      if (id) {
        response = await axios.put(`http://localhost:3002/produits/${id}`, formDataWithImage);
        console.log('Product updated successfully');
      } else {
        response = await axios.post('http://localhost:3002/produits', formDataWithImage);
        console.log('Product added successfully');
      }
      const imageUrl = response.data.imageUrl; // Supposons que l'URL de l'image soit renvoyée par le serveur dans la réponse
      setImageUrl(imageUrl); // Mettre à jour l'URL de l'image dans l'état
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <div className="formulaire-container">
      <h2>{id ? 'Modifier' : 'Ajouter'} un produit</h2>
      <form onSubmit={handleSubmit} className="formulaire">
        <label>Nom du produit:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Catégorie:</label>
        <select
          name="namecategorie" // Modifier pour correspondre au nouveau nom
          value={formData.namecategorie}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((categorie) => (
            <option key={categorie.id} value={categorie.namecategorie}> {/* Utilisez le nouveau nom de catégorie */}
              {categorie.namecategorie}
            </option>
          ))}
        </select>

        <label>Sous Catégorie:</label>
        <select
  name="namesubcategorie"
  value={formData.namesubcategorie}
  onChange={handleChange}
  disabled={!subCategories.length}
>
  <option value="">Sélectionnez une sous-catégorie</option>
  {subCategories.map((subcategorie) => (
    <option key={subcategorie.	idSubCategorie} value={subcategorie.namesubcategorie}>
      {subcategorie.namesubcategorie}
    </option>
  ))}
</select>


        <label>Marque:</label>
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
        <label>Prix:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        <label>Référence:</label>
        <input type="text" name="reference" value={formData.reference} onChange={handleChange} required />
        <label>Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} required />
        <input type="file" name="image" onChange={handleImage} />
         {imageUrl && <img src={imageUrl} alt="Product" />}
        <button type="submit">{id ? 'Modifier' : 'Ajouter'} Produit</button>
      </form>
    </div>
  );
};

export default FormulaireProduit;
