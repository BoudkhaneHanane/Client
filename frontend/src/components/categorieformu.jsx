import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import './formulaire.css';

const FormulaireCatégorie = () => {
  const { id } = useParams();
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (id) {
      fetchCategoryData();
    }
  }, [id]);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/categories/${id}`);
      console.log('Category data fetched:', response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.name.trim() === '') {
      console.error('Name field cannot be empty');
      return;
    }

    try {
      let response;
      if (id) {
        response = await axios.put(`http://localhost:3002/categories/${id}`, formData);
        console.log('Category updated successfully');
      } else {
        response = await axios.post('http://localhost:3002/categories', formData);
        console.log('Category added successfully');
      }
      history.push('/categories'); // Rediriger vers la liste des catégories après l'ajout/modification
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3002/categories/${id}`);
      console.log('Category deleted successfully');
      history.push('/categories'); // Rediriger vers la liste des catégories après la suppression
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="formulaire-container">
      <h2>{id ? 'Modifier' : 'Ajouter'} une Catégorie</h2>
      <form onSubmit={handleSubmit} className="formulaire">
        <label>Nom de la catégorie:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <button type="submit">{id ? 'Modifier' : 'Ajouter'} Catégorie</button>
        {id && <button type="button" onClick={handleDelete}>Supprimer Catégorie</button>}
      </form>
    </div>
  );
};

export default FormulaireCatégorie;
