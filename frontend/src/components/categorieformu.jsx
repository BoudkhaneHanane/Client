import React, { useState } from 'react';
import axios from 'axios';
import './categorieformu.css'; 
import SidBar from './sidbar';
import Nav from './nav';

function CategorieFormu() {
  const [namecategorie, setNamecategorie] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [showSubsubcategorieInput, setShowSubsubcategorieInput] = useState(false);
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [selectedSubcategoryIndex, setSelectedSubcategoryIndex] = useState(undefined);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const categoryResponse = await axios.post('http://localhost:3002/categories', {
        namecategorie,
      });
      const categoryId = categoryResponse.data.insertId;
      const subcategoryPromises = subcategories.map((subcategoryName) =>
        axios.post('http://localhost:3002/subcategories', {
          categoryName: namecategorie,
          namesubcategorie: subcategoryName,
        })
      );
      await Promise.all(subcategoryPromises);
  
      if (showSubsubcategorieInput && subsubcategories.length > 0) {
        const subsubcategoriePromises = subsubcategories.map((subsubcategorieName, index) =>
          axios.post('http://localhost:3002/subsubcategories', {
            namecategorie,
            namesubcategorie: subcategories[selectedSubcategoryIndex],
            namesubsubcategorie: subsubcategorieName,
          })
        );
        await Promise.all(subsubcategoriePromises);
      }
  
      console.log('Category, subcategories, and subsubcategories added');
      setNamecategorie('');
      setSubcategories([]);
      setSubsubcategories([]);
      setShowSubsubcategorieInput(false);
      setSelectedSubcategoryIndex(null);
    } catch (error) {
      console.error('Error adding category and/or subcategories:', error);
    }
  };
  

  const handleSubcategoryAdd = () => {
    setSubcategories([...subcategories, '']);
    setShowSubsubcategorieInput(false);
    setSelectedSubcategoryIndex(null);
  };
  
  const handleSubcategoryRemove = (index) => {
    const newSubcategories = [...subcategories];
    newSubcategories.splice(index, 1);
    setSubcategories(newSubcategories);
    setShowSubsubcategorieInput(false);
    setSelectedSubcategoryIndex(null);
  };
  
  const handleSubcategoryChange = (index, value) => {
    const newSubcategories = [...subcategories];
    newSubcategories[index] = value;
    setSubcategories(newSubcategories);
    setShowSubsubcategorieInput(false);
    setSelectedSubcategoryIndex(null);
  };
  
  const handleSubsubcategorieAdd = async () => {
    if (subsubcategories.includes(namecategorie)) {
      console.error("Subsubcategorie already exists for this category.");
      return;
    }
    setShowSubsubcategorieInput(true);
  };

  
  const handleSubsubcategorieChange = (event) => {
    const newSubsubcategorie = event.target.value;
    // Ajoutez directement la sous-sous-catégorie à l'état subsubcategories
    setSubsubcategories([newSubsubcategorie]);
  };
  
  
  

  return (
    <div>
      <div className='home'>
        <SidBar/>
          <div className='categorieformu'>
            <Nav/>
              <div className='formucategorie'>
                <form className="categorie-form" onSubmit={handleSubmit}>
                  <label htmlFor="namecategorie" className="form-label">Category Name:</label>
                  <input
                    type="text"
                    id="namecategorie"
                    className="form-input"
                    value={namecategorie}
                    onChange={(event) => setNamecategorie(event.target.value)}
                  />
                  <input
                    type="checkbox"
                    className="btn-add"
                    onChange={handleSubcategoryAdd}
                    checked={subcategories.length > 0}
                  />
                  <label htmlFor="checkbox" className="add-subcategory-label">
                    Add Subcategory
                  </label>
                  {subcategories.map((subcategory, index) => (
                    <div key={index} className="subcategory">
                      <input
                        type="text"
                        value={subcategory}
                        onChange={(event) => handleSubcategoryChange(index, event.target.value)}
                        className="form-input"
                      />
                      <button type="button" onClick={() => handleSubcategoryRemove(index)} className="btn-remove">
                        Remove
                      </button>
                    </div>
                  ))}
                  {subcategories.length > 0 && (
                    <>
                      <input
                        type="checkbox"
                        className="btn-add"
                        onChange={handleSubsubcategorieAdd}
                        checked={showSubsubcategorieInput}
                      />
                      <label htmlFor="checkbox" className="add-subsubcategorie-label">
                        Add Subsubcategorie
                      </label>
                      {showSubsubcategorieInput && (
                    <div>
                      <input
                        type="text"
                        placeholder="Enter subsubcategorie"
                        onChange={handleSubsubcategorieChange}
                        className="form-input"
                      />
                      <select
                        value={selectedSubcategoryIndex}
                        onChange={(event) => setSelectedSubcategoryIndex(Number(event.target.value))}
                        className="form-input"
                      >
                        <option value={null}>Select Parent Subcategory</option>
                        {subcategories.map((subcategory, index) => (
                          <option key={index} value={index}>{subcategory}</option>
                        ))}
                      </select>
                    </div>
                  )}
                    </>
                  )}
                  <button type="submit" className="btn-submit">Add Category</button>
                </form>
              </div>  
          </div>
      </div>
    </div>
  );
}

export default CategorieFormu;