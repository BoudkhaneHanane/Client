// OrderDetails.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/orderdetails/${orderId}`
        );
        setOrderDetails(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de la commande :",
          error
        );
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <>
      {selectedOrder && orderDetails.length > 0 && (
        <div>
          <h3>Détails de la commande</h3>
          <table>
            <thead>
              <tr>
                <th>ID du produit</th>
                <th>Quantité</th>
                <th>Prix total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((orderDetail) => (
                <tr key={orderDetail.idOrderline}>
                  <td>{orderDetail.idProduit}</td>
                  <td>{orderDetail.quantity}</td>
                  <td>{orderDetail.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderDetails;
