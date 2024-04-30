import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SidBar from './sidbar';
import Nav from './nav';
import axios from 'axios';
import './profil.css';

const ProfilAdmin = () => {
    const [adminData, setAdminData] = useState(null);

    useEffect(() => {
        fetchData();
    },);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/admin`);
            setAdminData(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données de l\'administrateur :', error);
        }
    }; 

    return (
        <div>
            <div className='home'>
                <SidBar/>
                <div className='homecontaineres'>
                    <Nav/>
                    <div className='homecontainer'>
                        <h2>Profil de Cheurfa Hanna</h2>
                        {adminData && (
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="text">First Name</td>
                                        <td>Cheurfa</td>
                                    </tr>
                                    <tr>
                                        <td className="text">Last Name</td>
                                        <td>Hanna</td>
                                    </tr>
                                    <tr>
                                        <td className="text">Email:</td>
                                        <td>cheurfa.hanna.sanna@gmail.com</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilAdmin;
