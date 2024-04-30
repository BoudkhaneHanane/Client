import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaSearch, FaEye } from 'react-icons/fa';
import SidBar from './sidbar';
import Nav from './nav';
import './products.css';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/orders');
            setOrders(response.data);
            setFilteredOrders(response.data); // Initialize filtered orders with all orders
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredOrders = orders.filter(order =>
            order.products.toLowerCase().includes(searchTerm) ||
            order.totalOrderPrice.toString().includes(searchTerm) ||
            order.typeLivraison.toLowerCase().includes(searchTerm) ||
            order.date.toLowerCase().includes(searchTerm) ||
            order.status.toLowerCase().includes(searchTerm)
        );
        setFilteredOrders(filteredOrders);
    };

    const handleDeleteDemande = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            await deleteAccount(orderId);
        }
    };

    const handleViewDetails = (orderId) => {
        // Redirigez l'utilisateur vers la page de détails de l'utilisateur avec son ID
        window.location.href = `/detailorder/${orderId}`;
    };

    return (
        <div>
            <div className='homes'>
                <SidBar />
                <div className='containeres'>
                    <Nav />
                    <div className='container'>
                        <div className="search-container">
                            <input type="text" placeholder="Rechercher une demande ..." onChange={handleSearch} />
                            <FaSearch className="search-icon" />
                        </div>
                        <h2 className='titre'>Liste des Demandes :</h2>
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Montant total</th>
                                    <th>Type de livraison </th>
                                    <th>Date de la commande</th>
                                    <th>Statut</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredOrders.map(order => (
                            <tr key={order.idOrder}>
                                <td>
                                    {order.products.split(',').length > 1 ? (
                                        // S'il y a plusieurs produits, affiche le nom du premier produit avec des points de suspension
                                        <>{order.products.split(',')[0]} ...</>
                                    ) : (
                                        // S'il y a un seul produit, affiche simplement son nom
                                        order.products
                                    )}
                                </td>
                                <td>{order.totalOrderPrice}</td>
                                <td>{order.typeLivraison}</td>
                                <td>{order.date}</td>
                                <td>{order.status}</td>
                                <td>
                                    <FaEye className='icons' onClick={() => handleViewDetails(order.idOrder)} />
                                    <FaTrash className='icon' onClick={() => handleDeleteDemande(order.idOrder)} />
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

export default Order;
