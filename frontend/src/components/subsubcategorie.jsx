import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaPlus, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SidBar from './sidbar';
import Nav from './nav';
import './styleadd.css';

const SubSubCategorie = () => {
    const [subsubcategories, setSubSubCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');



    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = (idSubSubCategorie) => {
        if (window.confirm('Are you sure you want to delete this subsubcategorie?')) {
          deleteSubSubCategorie(idSubCategorie);
        }
    };
    const deleteSubSubCategorie = async (idSUbSubCategorie) => {
        try {
          await axios.delete(`http://localhost:3002/subsubcategories/${idSubSubCategorie}`);
          fetchData();
        } catch (error) {
          console.error('Error deleting subsubcategorie:', error);
        }
    };
    

    const handleAdd = () => {
        // Logique pour ajouter un nouveau produit
        console.log('Ajout d\'une nouvelle Sub-Sub-catégorie');
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/subsubcategories');
            setSubSubCategories(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    }; 

    return (
       <div>
            <div className='home'>
                <SidBar/>
                <div className='homecontainers'>
                  <Nav/>
                <div className='homecontain'>
                <div className='add-product'>
                    <div className='search-bar'>
                        <div className="search-container">
                            <input type="text" placeholder="search a subsubcategorie..." onChange={handleSearch} />
                            <FaSearch className="search-icon" />
                        </div>
                    </div>    
                    <div className='add-product'>
                        <Link to={'/subsubcategorieformu'}>
                            <button type="button" className="button-add-productg" onClick={handleAdd}>
                                <FaPlus className="icon" /> Add sub-sub-categorie
                            </button>
                        </Link>
                    </div>
                    <h2 className='titr'>Liste des categorie:</h2>
                    <table className="products-table">
                        <thead>
                            <tr>

                                <th>SubSubCategorie</th>
                                <th>SubCategorie</th>
                                <th>Categorie</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subsubcategories.map(subsubcategorie=> (
                                <tr key={subsubcategorie.idSubSubCategorie  }>
                                    <td>{subsubcategorie.namesubsubcategorie}</td>
                                    <td>{subsubcategorie.nameSubCategorie}</td>
                                    <td>{subsubcategorie.namecategorie}</td>
                                    <td>
                                        <FaTrash className='icon' onClick={() => handleDelete(subsubcategorie.idSubSubCategorie )} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> 
        </div>
        </div>    
        </div>
    );
};

export default SubSubCategorie;