import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidBar from './sidbar';
import Nav from './nav';
import './categorieformu.css';

function SubCategoryFormu() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategory, setSubCategoryName] = useState('');
  const [subSubCategory, setSubSubCategory] = useState('');
  const [createSubSubCategory, setCreateSubSubCategory] = useState(false);

  useEffect(() => {
    fetchCategoriesFromDatabase();
  }, []);

  const fetchCategoriesFromDatabase = async () => {
    try {
      const response = await axios.get('http://localhost:3002/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories depuis la base de données:', error);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    setSelectedCategory(categoryName);
    setSubCategoryName('');
    setSubSubCategory('');
  };

  const handleSubCategoryChange = (e) => {
    setSubCategoryName(e.target.value);
  };

  const handleSubSubCategoryChange = (e) => {
    setSubSubCategory(e.target.value);
  };

  const handleCreateSubSubCategory = (e) => {
    setCreateSubSubCategory(e.target.checked);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3002/subcategorie', {
        namecategorie : selectedCategory,
        namesubcategorie: subCategory
      });
      setSubCategoryName('');
      console.log('Sous-catégorie insérée avec succès');

      if (createSubSubCategory) {
        await axios.post('http://localhost:3002/subsubcategorie', {
          namecategorie: selectedCategory,
          namesubcategorie: subCategory,
          namesubsubcategorie: subSubCategory
        });
        setSubSubCategory('');
        console.log('Sous-sous-catégorie insérée avec succès');
      }
    } catch (error) {
      console.error("Erreur lors de l'insertion dans la base de données:", error);
    }
  };

  return (
         <div>
            <div className='homes'>
                <SidBar/>
                <div >
                  <Nav/>
                  <div className="category-form">
                    <h2 className='titr'>add sub Categorie</h2>
                    <label htmlFor="category" className="form-label">Catégorie :</label>
                    <select
                      onChange={(event) => handleCategoryChange(event)}
                      className="form-input category-select"
                      value={selectedCategory}
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map((category) => (
                        <option key={category.idCategorie} value={category.namecategorie}>
                          {category.namecategorie}
                        </option>
                      ))}
                    </select>
                
                    {selectedCategory && (
                      <div className="subcategory-section">
                        <label htmlFor="subcategory" className="form-label">Sous-catégorie :</label>
                        <input
                          type="text"
                          value={subCategory}
                          onChange={handleSubCategoryChange}
                          placeholder="Entrez la sous-catégorie"
                          className="form-input"
                        />
                        {!createSubSubCategory && (
                          <button onClick={handleSubmit} className="form-button">Enregistrer</button>
                        )}
                      </div>
                    )}
                
                    {selectedCategory && subCategory && (
                      <div className="subsubcategory-section">
                        <label className="form-label">
                          <input
                            type="checkbox"
                            checked={createSubSubCategory}
                            onChange={handleCreateSubSubCategory}
                            className="form-input"
                          />
                          Créer une sous-sous-catégorie pour la sous-catégorie
                        </label>
                        {createSubSubCategory && (
                          <div className="subsubcategory-input-section">
                            <label htmlFor="subsubcategory" className="form-label">Sous-sous-catégorie :</label>
                            <input
                              type="text"
                              value={subSubCategory}
                              onChange={handleSubSubCategoryChange}
                              placeholder="Entrez la sous-sous-catégorie"
                              className="checkbox"
                            />
                            <button onClick={handleSubmit} className="form-button">Enregistrer</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              </div> 
            );
          }
export default SubCategoryFormu;  
