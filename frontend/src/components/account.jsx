import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import SidBar from './sidbar';
import NavAdmin from './navadmin';
import './products.css';

const Account = () => {
    const [demandes, setDemandes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/acount');
            setDemandes(response.data);
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
                        <input type="text" placeholder="Rechercher un produit..." onChange={handleSearch} />
                        <FaSearch className="search-icon" />
                    </div>
                    <h2 className='titre'>Liste des demandes</h2>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>first name</th>
                                <th>last name</th>
                                <th>adress</th>
                                <th>email</th>
                                <th>Company Name</th>
                                <th>Business Registration</th>
                                <th>Tax Identification Number</th>
                                <th>Tax Article</th>
                                <th>Registration Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {demandes.map(demande => (
                                <tr key={demande.idDemande}>
                                    <td>{demande.idDemande}</td>
                                    <td>{demande.nom}</td>
                                    <td>{demande.prenom}</td>
                                    <td>{demande.adresse}</td>
                                    <td>{demande.email}</td>
                                    <td>{demande.nom_entreprise}</td>
                                    <td>{demande.business_registration}</td>
                                    <td>{demande.tax_identification_number}</td>
                                    <td>{demande.tax_article}</td>
                                    <td>{demande.registration_number}</td>
                                    <td>
                                        <FaEye className='icon' onClick={() => handleViewDetails(demande.idDemande)} />
                                        <FaTrash className='icon' onClick={() => handleDeleteDemande(demande.idDemande)} />
                                        <FaEdit className='icon' onClick={() => handleEditDemande(demande.idDemande)} />
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

export default Account;