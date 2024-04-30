import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SidBar from './sidbar';
import Nav from './nav';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import './profil.css';
const Revendeur = () => {
    const { idDemande } = useParams();
    const [userRevendeur, setUserRevendeur] = useState(null);

    useEffect(() => {
        fetchData();
    }, [idDemande]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/revendeur/${idDemande}`);
            setUserRevendeur(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données du revendeur:', error);
        }
    };

    const handleValidation = async () => {
        try {
            // Envoyer une requête pour valider la demande
            await axios.post(`http://localhost:3002/validate/${idDemande}`);
            // Mettre à jour l'état de l'utilisateur
            setUserRevendeur({ ...userRevendeur, statut: 'approuvée' });
        } catch (error) {
            console.error('Erreur lors de la validation de la demande:', error);
        }
    };

    const handleSuppression = async () => {
        try {
            // Envoyer une requête pour supprimer la demande
            await axios.delete(`http://localhost:3002/delete/${idDemande}`);
            // Mettre à jour l'état de l'utilisateur
            setUserRevendeur(null);
        } catch (error) {
            console.error('Erreur lors de la suppression de la demande:', error);
        }
    };

    if (!userRevendeur) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className='home'>
                <SidBar/> 
                <div className='homecontaineres'>
                    <Nav/>
                
                <div className='homecontainer'>
                    <h2>Détails du revendeur</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td className="text">Nom de l'entreprise :</td>
                                <td>{userRevendeur.nom_entreprise}</td>
                            </tr>
                            <tr>
                                <td className="text">Enregistrement d'entreprise :</td>
                                <td>{userRevendeur.business_registration}</td>
                            </tr>
                            <tr>
                                <td className="text">Numéro d'identification fiscale :</td>
                                <td>{userRevendeur.tax_identification_number}</td>
                            </tr>
                            <tr>
                                <td className='text'>Article fiscal :</td>
                                <td>{userRevendeur.tax_article}</td>
                            </tr>
                            <tr>
                                <td className='text'>Numéro d'enregistrement :</td>
                                <td>{userRevendeur.registration_number}</td>
                            </tr>
                            <tr>
                                <td className='text'>Statut :</td>
                                <td>{userRevendeur.statut}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        {userRevendeur.statut === 'approuvée' ? (
                            <Alert variant="standard" color="success">
                            Demande déjà validée
                            </Alert>
                        ) : (
                            <button onClick={handleValidation}>Valider la demande</button>
                        )}
                        <button onClick={handleSuppression}>Supprimer la demande</button>
                    </div>
                </div>
            </div>
        </div>  
        </div>  
    );
};

export default Revendeur;

