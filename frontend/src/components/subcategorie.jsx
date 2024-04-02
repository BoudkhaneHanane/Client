import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import SidBar from './sidbar';
import NavAdmin from './navadmin';
import './products.css';

const SubCategories = () => {
    const [subcategories, setSubCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editCategorie, setEditCategorie] = useState(-1);

    
    const handleDelete = (idCategorie) => {
        if (window.confirm('Are you sure you want to delete this Catégorie')) {
          deleteProduct(idCategorie);
        }
    };
    const deleteProduct = async (idCategorie) => {
        try {
          await axios.delete(`http://localhost:3002/produits/${idCategorie}`);
          fetchData();
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      };
    

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
                                <th>Catégorie</th>
                                <th>SubCatégorie</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subcategories.map(subcategorie => (
                                <tr key={subcategorie.idSubCategorie }>
                                    <td>{subcategorie.idSubCategorie }</td>
                                    <td>{subcategorie.namesubcategorie}</td>
                                    <td>{subcategorie.namecategorie}</td>
                                    <td>
                                        <FaTrash className='icon' onClick={() => handleDelete(subcategorie.idSubCategorie)} />
                                        <FaEdit  className='icons' onClick={() => handleEdit(subcategorie.idSubCategorie)} />
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