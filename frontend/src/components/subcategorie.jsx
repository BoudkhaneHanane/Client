import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash,  FaSearch, FaPlus } from 'react-icons/fa';
import SidBar from './sidbar';
import Nav from './nav';
import { Link } from 'react-router-dom';
import './styleadd.css';

const SubCategories = () => {
    const [subcategories, setSubCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');



    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleAdd = () => {
        // Logique pour ajouter un nouveau produit
        console.log('Ajout d\'une nouvelle catégorie');
    };


    const handleDelete = (idSubCategorie) => {
        if (window.confirm('Are you sure you want to delete this subcategorie?')) {
          deleteSubCategorie(idSubCategorie);
        }
    };
    const deleteSubCategorie = async (idSubCategorie) => {
        try {
          await axios.delete(`http://localhost:3002/subcategories/${idSubCategorie}`);
          fetchData();
        } catch (error) {
          console.error('Error deleting subcategorie:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/subcategorie');
            setSubCategories(response.data);
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
                            <input type="text" placeholder="search a user..." onChange={handleSearch} />
                            <FaSearch className="search-icon" />
                        </div>
                    </div>
                    <div className='add-product'>
                        <Link to={'/subcategorieformu'}>
                            <button type="button" className="button-add-productg" onClick={handleAdd}>
                                <FaPlus className="icon" /> Add categorie
                            </button>
                        </Link>
                    </div>
                    <h2 className='titr'>Liste des sous categorie:</h2>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th> Cattegorie</th>
                                <th>subcategorie</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subcategories.map(subcategorie => (
                                <tr key={subcategorie.idSubCategorie }>
                                    <td>{subcategorie.namecategorie}</td>
                                    <td>{subcategorie.namesubcategorie}</td>
                                    <td>
                                        <FaTrash className='icon' onClick={() => handleDelete(subcategorie.idSubCategorie)} />
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

export default SubCategories;