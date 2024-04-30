import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SidBar from './sidbar';
import './styleadd.css';
import Nav from './nav';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCategories = categories.filter(categorie =>
        categorie.namecategorie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (idCategorie) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategorie(idCategorie);
        }
    };

    const deleteCategorie = async (idCategorie) => {
        try {
            await axios.delete(`http://localhost:3002/categories/${idCategorie}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };
    const handleAdd = () => {
        // Logique pour ajouter un nouveau produit
        console.log('Ajout d\'une nouvelle catégorie');
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                                    <input type="text" placeholder="Search a category..." onChange={handleSearch} />
                                    <FaSearch className="search-icon" />
                                </div>
                            </div>
                            <div className='add-product'>
                                <Link to={'/categorieformu'}>
                                    <button type="button" className="button-add-productg" onClick={handleAdd}>
                                        <FaPlus className="icon" /> Add category
                                    </button>
                                </Link>
                            </div>
                            <h2 className='titr'>Liste des catégories:</h2>
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.map(categorie => (
                                        <tr key={categorie.idCategorie}>
                                            <td>{categorie.namecategorie}</td>
                                            <td>
                                                <FaTrash className='icon' onClick={() => handleDelete(categorie.idCategorie)} />
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

export default Categories;
