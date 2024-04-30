import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './formulaire.css';
import SidBar from './sidbar';
import Nav from './nav';

const FormulaireProduit = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    namecategorie: '', 
    namesubcategorie: '', 
    namesubsubcategorie:'',
    brand: '',
    price: '',
    reference: '',
    description: '',
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoriesUpdated, setCategoriesUpdated] = useState(new Date().getTime());
  const [subSubCategories, setSubSubCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProductData();
    }
  }, [categoriesUpdated, id]);

  const resetSubSubCategories = () => {
    setSubSubCategories([]);
  };

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
      namesubcategorie: '',
      namesubsubcategorie: '', // Assurez-vous de vider également la sous-catégorie sélectionnée
    });
    resetSubSubCategories();
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
  
// Handler pour la sélection de la sous-catégorie
const handleSubCategoryChange = async (e) => {
  const subCategoryName = decodeURIComponent(e.target.value);
  console.log('Selected subcategory name:', subCategoryName);
  setFormData({
    ...formData,
    namesubcategorie: subCategoryName,
    namesubsubcategorie: '', // Réinitialiser la sous-sous-catégorie sélectionnée
  });
  resetSubSubCategories(); // Réinitialiser les sous-sous-catégories
  fetchSubSubCategories(formData.namecategorie, subCategoryName); // Appel à fetchSubSubCategories
};

const fetchSubSubCategories = async (categoryName, subCategoryName) => {
  try {
    if (!categoryName || !subCategoryName) {
      return;
    }
    const encodedCategoryName = encodeURIComponent(categoryName);
    const encodedSubCategoryName = encodeURIComponent(subCategoryName);
    const response = await axios.get(`http://localhost:3002/categories/${encodedCategoryName}/subcategories/${encodedSubCategoryName}/subsubcategories`);
    console.log('Subsubcategories fetched:', response.data);
    setSubSubCategories(response.data);
  } catch (error) {
    console.error('Error fetching subsubcategories:', error);
  }
};

const fetchProductData = async () => {
  try {
    const response = await axios.get(`http://localhost:3002/produits/${id}`);
    console.log('Product data fetched:', response.data);
    const { name, namecategorie, namesubcategorie, namesubsubcategorie, brand, price, reference, description } = response.data;
    setFormData({
      name,
      namecategorie,
      namesubcategorie,
      namesubsubcategorie,
      brand,
      price,
      reference,
      description,
    });
    setImageUrl(response.data.imageUrl); // Mettre à jour l'URL de l'image
    fetchSubSubCategories(namecategorie, namesubcategorie, ); // Récupérer les sous-sous-catégories pour les pré-sélectionner
  } catch (error) {
    console.error('Error fetching product data:', error);
  }
};
  

const handleImageChange = (e, index) => {
  const files = e.target.files;
  const newImages = [...images];
  newImages[index] = files[0];
  setImages(newImages);
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formDataWithImage = new FormData();
  
    if (formData.reference.trim() === '') {
      console.error('Reference field cannot be empty');
      return;
    }
  
    images.forEach((image, index) => {
      formDataWithImage.append(`image${index + 1}`, image);
    });
  
    formDataWithImage.append('name', formData.name);
    formDataWithImage.append('namecategorie', formData.namecategorie);
    formDataWithImage.append('namesubcategorie', formData.namesubcategorie);
    formDataWithImage.append('namesubsubcategorie', formData.namesubsubcategorie);
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
      console.log('Full Axios error object:', error);
    }
  };
  return (
    <div>
            <div className='home'>
                <SidBar/>
                <div className='formulaire-containeres'>
                <Nav/>
    <div className="formulaire-container">
      <h2 className=''>{id ? 'Modifier' : 'Ajouter'} un produit</h2>
      <form onSubmit={handleSubmit} className="formulaire">
  <label>Nom du produit:</label>
  <input type="text" name="name" value={formData.name} onChange={handleChange} required />

  <label>Catégorie:</label>
  <select
    name="namecategorie"
    value={formData.namecategorie}
    onChange={handleCategoryChange}
    required
  >
    <option value="">Sélectionnez une catégorie</option>
    {categories.map((categorie) => (
      <option key={categorie.id} value={categorie.namecategorie}>
        {categorie.namecategorie}
      </option>
    ))}
  </select>

  <label>Sous Catégorie:</label>
  <select
    name="namesubcategorie"
    value={formData.namesubcategorie}
    onChange={handleSubCategoryChange}
    disabled={!subCategories.length}
  >
    <option value="">Sélectionnez une sous-catégorie</option>
    {subCategories.map((subcategorie) => (
      <option key={subcategorie.idSubCategorie} value={subcategorie.namesubcategorie}>
        {subcategorie.namesubcategorie}
      </option>
    ))}
  </select>

  <label>Sub Sous Catégorie:</label>
  <select
    name="namesubsubcategorie"
    value={formData.namesubsubcategorie}
    onChange={handleChange}
    disabled={!subSubCategories.length}
  >
    <option value="">Sélectionnez une sous sous-catégorie</option>
    {subSubCategories.map((subsubcategorie) => (
      <option key={subsubcategorie.idSubSubCategorie} value={subsubcategorie.namesubsubcategorie}>
        {subsubcategorie.namesubsubcategorie}
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
{!id &&(
  <>{Array.from({ length: 5 }, (_, index) => (
    <div key={index}>
      <label>Image {index + 1}:</label>
      <input type="file" name="image[]" onChange={(e) => handleImageChange(e, index)} />
    </div>
  ))}
  </>
)}
  <button type="submit">{id ? 'Modifier' : 'Ajouter'} Produit</button>
</form>
    </div>
    </div>
    </div>
    </div>
  );
};

export default FormulaireProduit;