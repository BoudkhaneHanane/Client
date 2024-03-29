import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import SidBar from './sidbar';
import NavAdmin from './navadmin';
import './products.css';

const SubCategories = () => {
    const [subcategories, setSubCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');



    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
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
                <div className='homecontainer'>
                    <NavAdmin/>
                    <div className="search-container">
                        <input type="text" placeholder="search a user..." onChange={handleSearch} />
                        <FaSearch className="search-icon" />
                    </div>
                    <h2 className='titre'>Liste des sous categorie:</h2>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>id Cattegorie</th>
                                <th>name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subcategories.map(subcategories => (
                                <tr key={subcategories.idSubCategorie }>
                                    <td>{subcategories.idSubCategorie }</td>
                                    <td>{subcategories.idCategorie}</td>
                                    <td>{subcategories.name}</td>
                                    <td>
                                        <FaTrash className='icon' onClick={() => handleDelete(subcategories.idSubCategorie)} />
                                        <FaEdit  className='icons' onClick={() => handleEdit(subcategories.idCSubategorie)} />
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

export default SubCategories;