import React, { useState, useEffect } from "react";
import axios from "axios";

function History({ nom, prenom }) {
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    // Fetch order history data from the server
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`/orderhistory/${nom}/${prenom}`);
        console.log("Order History:", response.data); // Log the fetched data
        setOrderHistory(response.data);
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    fetchOrderHistory();
  }, [nom, prenom]);

  return (
    <div>
      <h2>Order History</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orderHistory.map((order) => (
            <tr key={order.idOrder}>
              <td>{order.nom}</td>
              <td>{order.prenom}</td>
              <td>{order.numTele}</td>
              <td>{order.address}</td>
              <td>{order.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;
