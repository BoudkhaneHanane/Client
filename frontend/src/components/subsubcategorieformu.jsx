import React, { useState, useEffect } from 'react';
import SidBar from './sidbar';
import axios from 'axios';
import Nav from './nav';
import './categorieformu.css'; 

function SubSubCategorieFormu() {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategory, setSubSubCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
  
    const fetchCategoriesFromDatabase = async () => {
      try {
        const response = await axios.get('http://localhost:3002/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories depuis la base de données:', error);
      }
    };
    
    const fetchSubCategoriesFromDatabase = async (categoryName) => {
      try {
        const response = await axios.get(`http://localhost:3002/categories/${categoryName}/subcategories`);
        setSubCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des sous-catégories depuis la base de données:', error);
      }
    };
  
    const handleCategoryChange = (e) => {
      const categoryName = e.target.value;
      setSelectedCategory(categoryName);
      setSelectedSubCategory('');
      setSubSubCategory('');
      fetchSubCategoriesFromDatabase(categoryName);
    };
  
    const handleSubCategoryChange = (e) => {
      setSelectedSubCategory(e.target.value);
      setSubSubCategory('');
    };
  
    const handleSubSubCategoryChange = (e) => {
      setSubSubCategory(e.target.value);
    };
  
    const handleSubmit = async () => {
      try {
        await axios.post('http://localhost:3002/subsubcategories', {
          idSubSubCategorie: selectedSubCategory,
          namesubcategorie: selectedSubCategory,
          namecategorie: selectedCategory,
          namesubsubcategorie: subSubCategory
        });
        // Si la requête POST réussit, vous pouvez effectuer des actions supplémentaires, comme vider les champs de saisie
        setSubSubCategory('');
        console.log('Sous-sous-catégorie insérée avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'insertion de la sous-sous-catégorie dans la base de données:', error);
      }
    };
  
    useEffect(() => {
      fetchCategoriesFromDatabase();
    }, []);
  

  return (
    <div>
            <div className='homes'>
                <SidBar/>
                <div >
                  <Nav/>
        <div className="category-form">
          <label htmlFor="category" className="form-label">Catégorie :</label>
          <select
            onChange={(event) => handleCategoryChange(event)}
            className="form-input category-select"
            value={selectedCategory}
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category) => (
              <option key={category.idCategorie} value={category.namecategorie}>{category.namecategorie}</option>
            ))}
          </select>
      
          {selectedCategory && (
            <div className="subcategory-section">
              <label htmlFor="subcategory" className="form-label">Sous-catégorie :</label>
              <select
                onChange={(event) => handleSubCategoryChange(event)}
                value={selectedSubCategory}
                className="form-input subcategory-select"
              >
                <option value="">Sélectionnez une sous-catégorie</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.namecategorie} value={subCategory.namecategorie}>{subCategory.namesubcategorie}</option>
                ))}
              </select>
            </div>
          )}
      
          {selectedSubCategory && (
            <div className="subsubcategory-section">
              <label htmlFor="subsubcategory" className="form-label">Sous-sous-catégorie :</label>
              <input
                type="text"
                id="subsubcategory"
                value={subSubCategory}
                onChange={handleSubSubCategoryChange}
                className="form-input subsubcategory-input"
              />
              <button onClick={handleSubmit} className="form-button">Ajouter Sous-sous-catégorie</button>
            </div>
          )}
        </div>
      </div> 
      </div> 
      </div>
      );
  }

  export default SubSubCategorieFormu;
