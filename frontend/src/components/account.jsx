import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaEye, FaTrash } from 'react-icons/fa';
import './products.css';
import SidBar from './sidbar';
import Nav from './nav';
const Account = () => {
    const [demandes, setDemandes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/account');
            setDemandes(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    }; 

    const handleDeleteDemande = async (idDemande) => {
        if (window.confirm('Are you sure you want to delete this demande?')) {
            await deleteAccount(idDemande);
        }
    };

    const deleteAccount = async (idDemande) => {
        try {
            await axios.delete(`http://localhost:3002/account/${idDemande}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const filteredDemandes = demandes.filter(demande =>
        demande.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.nom_entreprise.toLowerCase().includes(searchTerm.toLowerCase())||
        demande.statut.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className='homes'>
                <SidBar/>
                <div className='containeres'>
                <Nav/>
                <div className='container'>
                   
                    <div className="search-container">
                        <input type="text" placeholder="Rechercher un produit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <FaSearch className="search-icon" />
                    </div>
                    <h2 className='titre'>Liste des demandes</h2>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Email</th>
                                <th>Company Name</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDemandes.map(demande => (
                                <tr key={demande.idDemande}>
                                    <td>{demande.nom}</td>
                                    <td>{demande.prenom}</td>
                                    <td>{demande.adresse}</td>
                                    <td>{demande.email}</td>
                                    <td>{demande.nom_entreprise}</td>
                                    <td>{demande.statut}</td>
                                    <td>
                                    {demande.idDemande && (
                                        <Link to={`/revendeur/${demande.idDemande}`}>
                                            <FaEye className='icons' />
                                        </Link>
                                    )}
                                        <FaTrash className='icon' onClick={() => handleDeleteDemande(demande.idDemande)} />
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

export default Account;
