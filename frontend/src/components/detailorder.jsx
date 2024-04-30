import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SidBar from './sidbar';
import Nav from './nav';
import './detailorder.css';

const DetailOrder = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [orderId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/orders/${orderId}`);
      setOrderData(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de la commande :', error);
    }
  }; 

  const handleAffectOrder = async () => {
    try {
      // Mettre à jour l'état de la commande pour l'affecter
      await axios.put(`http://localhost:3002/orders/${orderId}/affect`, { status: 'confirmed' });

      // Recharger les données de la commande
      fetchData();
    } catch (error) {
      console.error('Erreur lors de l\'affectation de la commande :', error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      // Mettre à jour l'état de la commande pour l'annuler
      await axios.put(`http://localhost:3002/orders/${orderId}`, { status: 'CANCELLED' });
      // Recharger les données de la commande
      fetchData();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la commande :', error);
    }
  };

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className='detail'>
        <SidBar/>
        <div className='detailorders'>
          <Nav/>
          <div className='detailorder'>
            <h2>Commande de {orderData.nom} {orderData.prenom}</h2>
            <p>Adresse: {orderData.address}</p>
            <p>Numéro de téléphone: {orderData.numTele}</p>
            <p>Date de la commande: {orderData.date}</p>
            <p>Montant total: {orderData.totalOrderPrice}</p>
            <p>Type de Livraison: {orderData.typeLivraison}</p>
            <p>Statut: {orderData.status}</p>
            <p>Versement: {orderData.versement}</p>
            <h3>Produits commandés:</h3>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Nom du produit</th>
                  <th>Quantité</th>
                  <th>Prix total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.products.map(product => (
                  <tr key={product.name}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <button onClick={handleAffectOrder}>Affect</button>
              <button onClick={handleCancelOrder}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;

