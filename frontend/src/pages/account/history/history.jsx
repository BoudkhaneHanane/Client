// OrderHistory.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderHistory = ({ nom, prenom }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/orderhistory/${nom}/${prenom}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      }
    };

    if (nom && prenom) {
      fetchOrders();
    }
  }, [nom, prenom]);

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div>
      <h2>Historique des commandes</h2>
      <table>
        <thead>
          <tr>
            <th>ID de la commande</th>
            <th>Date</th>
            <th>Prix total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.idOrder}
              onClick={() => handleOrderClick(order.idOrder)}
            >
              <td>{order.idOrder}</td>
              <td>{order.date}</td>
              <td>{order.totalOrderPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
