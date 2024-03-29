import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaEye } from 'react-icons/fa';
import SidBar from './sidbar';
import NavAdmin from './navadmin';
import './products.css';

const Products = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');



    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/users');
            setUsers(response.data);
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
                    <h2 className='titre'>Liste des utilisateurs:</h2>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.idUtilisateur }>
                                    <td>{user.idUtilisateur }</td>
                                    <td>{user.nom}</td>
                                    <td>{user.prenom}</td>
                                    <td>{user.email}</td>
                                    <td>{user.type}</td>
                                    <td>
                                        <Link to={'/profiluser'}>
                                            <FaEye className='icon' onClick={() => handleViewDetails(user.idUtilisateur)} />
                                        </Link>
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

export default Products;