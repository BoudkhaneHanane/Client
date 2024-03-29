import React, { useState } from 'react';
import axios from 'axios';
import './formulaire.css';

const FormulaireProduit = () => {
  const [image, setImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    idCategorie: '',
    idSubCategorie: '',
    brand: '',
    price: '',
    reference: '',
    description: '',
  });

  const handleApi = () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', formData.name);
    // Ajoutez d'autres données du formulaire si nécessaire
    axios.post('http://localhost:3002/produits', formData).then((res) => {
        console.log(res);
    }).catch((error) => {
        console.error('Error uploading image:', error);
    });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Vérifiez si la référence est vide avant de soumettre le formulaire
    if (formData.reference.trim() === '') {
      console.error('Reference field cannot be empty');
      return;
    }
    
    const formDataWithImage = new FormData();
    formDataWithImage.append('image', image);
    formDataWithImage.append('name', formData.name);
    formDataWithImage.append('idCategorie', formData.idCategorie);
    formDataWithImage.append('idSubCategorie', formData.idSubCategorie); 
    formDataWithImage.append('brand', formData.brand); 
    formDataWithImage.append('price', formData.price);
    formDataWithImage.append('reference', formData.reference); 
    formDataWithImage.append('description', formData.description); 

    // Ajoutez d'autres données du formulaire si nécessaire
  
    try {
      const response = await fetch('http://localhost:3002/produits', {
        method: 'POST',
        body: formDataWithImage,
      });
  
      if (response.ok) {
        // Handle success
        console.log('Form data and image successfully submitted');
      } else {
        // Handle error
        console.error('Failed to submit form data and image:', response.statusText);
      }
    } catch (error) {
      // Handle network errors or exceptions
      console.error('An error occurred while submitting form data and image:', error);
    }
  };

  return (
    <div className="formulaire-container">
      <h2>Ajouter un produit</h2>
      <form onSubmit={handleSubmit} className="formulaire">
        <label>Nom du produit:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <label>Catégorie:</label>
        <input type="text" name="idCategorie" value={formData.idCategorie} onChange={handleChange} required />
        <label>Sous-catégorie:</label>
        <input type="text" name="idSubCategorie" value={formData.idSubCategorie} onChange={handleChange} required />
        <label>Marque:</label>
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
        <label>Prix:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        <label>Référence:</label>
        <input type="text" name="reference" value={formData.reference} onChange={handleChange} required />
        <label>Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} required />
        <input type="file" name="image" onChange={handleImage} />
    <button type="submit">Ajouter Produit</button>
      </form>
    </div>
  );
};

export default FormulaireProduit;

