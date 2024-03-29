import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaSearch } from 'react-icons/fa';

import SidBar from './sidbar';
import NavAdmin from './navadmin';
import './products.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');



    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    }; 

    return (
       <div>
            <div className='home'>
                <SidBar/>
                <div className='homecontainer'>
                    <NavAdmin/>
                    <div className="search-container">
                        <input type="text" placeholder="search a user..." onChange={handleSearch} />
                        <FaSearch className="search-icon" />
                    </div>
                    <h2 className='titre'>Liste des categorie:</h2>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(categorie => (
                                <tr key={categorie.idCategorie }>
                                    <td>{categorie.idCategorie }</td>
                                    <td>{categorie.name}</td>
                                    <td>
                                        <FaTrash className='icon' onClick={() => handleDelete(categorie.idCategorie)} />
                                        <FaEdit  className='icons' onClick={() => handleEdit(categorie.idCategorie)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> 
        </div>
    );
};

export default Categories;