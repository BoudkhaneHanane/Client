import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./history.css";

const History = ({ nom, prenom }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/orders/${nom}/${prenom}`
        );
        console.log("Orders:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [nom, prenom]);

  const getStatusColor = (status) => {
    if (status === "confirmed") {
      return "green"; // Green color for confirmed status
    } else if (status === "cancelled") {
      return "red"; // Red color for cancelled status
    }
    return "inherit"; // Default color
  };

  return (
    <div className="history-container">
      <h2>History of Your Orders</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.idOrder}>
              <td>
                <Link
                  to={`/orderdetail/${order.idOrder}`}
                  className="order-link"
                >{`Order ${index + 1}`}</Link>
              </td>
              <td>{order.totalOrderPrice}DA</td>
              <td style={{ color: getStatusColor(order.status) }}>
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
