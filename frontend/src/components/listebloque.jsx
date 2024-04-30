import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaEye } from 'react-icons/fa';
import SidBar from './sidbar';
import Nav from './nav';
import './products.css';

const ListeBloque = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/listebloques');
            setUsers(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    }; 

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleViewDetails = (userId) => {
        // Redirigez l'utilisateur vers la page de détails de l'utilisateur avec son ID
        window.location.href = `/profiluser/${userId}`;
    };

    const filteredUsers = users.filter(user =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
       <div>
            <div className='homes'>
                <SidBar/>
                <div className='containeres'>
                    <Nav/>
                    <div className='container'>
                        <div className="search-container">
                            <input type="text" placeholder="Search a user..." onChange={handleSearch} />
                            <FaSearch className="search-icon" />
                        </div>
                        <h2 className='titre'>Liste des utilisateurs:</h2>
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.idUtilisateur}>
                                        <td>{user.nom}</td>
                                        <td>{user.prenom}</td>
                                        <td>{user.email}</td>
                                        <td>{user.type}</td>
                                        <td>{user.blocked === 1 ? 'Bloqué' : 'Actif'}</td>
                                        <td>
                                            <Link to={`/profiluser/${user.idUtilisateur}`}>
                                                <FaEye className='icons' onClick={() => handleViewDetails(user.idUtilisateur)} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div> 
            </div>
        </div>
    );
};

export default ListeBloque;
