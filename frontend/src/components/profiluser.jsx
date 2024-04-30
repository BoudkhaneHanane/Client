import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SidBar from './sidbar';
import Nav from './nav';
import axios from 'axios';
import './profil.css';

const ProfilUser = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/users/${userId}`);
            setUserData(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
        }
    }; 

    const handleBlockUser = async () => {
        try {
            await axios.put(`http://localhost:3002/users/${userId}/block`);
            setUserData({ ...userData, blocked: 1 });
        } catch (error) {
            console.error('Erreur lors du blocage de l\'utilisateur :', error);
        }
    };
    
    const handleUnblockUser = async () => {
        try {
            await axios.put(`http://localhost:3002/users/${userId}/unblock`);
            setUserData({ ...userData, blocked: 0 });
        } catch (error) {
            console.error('Erreur lors du déblocage de l\'utilisateur :', error);
        }
    };
  
    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
      <div>
      <div className='home'>
            <SidBar/>
            <div className='homecontaineres'>
              <Nav/>
           
            <div className='homecontainer'>

                <h2>Profil de {userData.nom} {userData.prenom}</h2>
                <table>
                    <tbody>
                      <tr>
                        <td className="text">First Name</td>
                        <td>{userData.nom}</td>
                      </tr>
                      <tr>
                        <td className="text">Last Name</td>
                        <td >{userData.prenom}</td>
                      </tr>
                      <tr>
                        <td className="text">Email:</td>
                        <td >{userData.email}</td>
                      </tr>
                      <tr>
                        <td className="text">Type:</td>
                        <td >{userData.type}</td>
                      </tr>
                      <tr>
                        <td className="text">Adresse:</td>
                        <td >{userData.adresse}</td>
                      </tr>
                      <tr>
                        <td className="text">Numéro de téléphone:</td>
                        <td>{userData.numero_telephone}</td>
                      </tr>
                      <tr>
                        <td className="text">Date de naissance:</td>
                        <td >{userData.Date_anniversaire}</td>
                      </tr>
                      <tr>
                        <td className="text">Statut:</td>
                        <td >{userData.blocked === 1 ? 'Bloqué' : 'Actif'}</td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          {userData.blocked === 1 ? (
                              <button onClick={handleUnblockUser}>Débloquer l'utilisateur</button>
                          ) : (
                              <button onClick={handleBlockUser}>Bloquer l'utilisateur</button>
                          )}
                      </td>
                                      </tr>
                    </tbody>
                </table>
                </div>   
        </div>
      </div>
    </div>    
);
};

export default ProfilUser;
