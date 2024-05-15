import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./orderdetail.css";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/orderdetails/${orderId}`
        );
        console.log("Order details:", response.data);
        setOrderDetails(response.data);
        // Extract order information from the first item in the orderDetails array
        setOrderInfo(response.data[0]);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="order-detail-container">
      <h2>Order Details</h2>
      {orderInfo && (
        <div className="order-info">
          <p>Order ID: {orderInfo.idOrder}</p>
          <p>
            Customer Name: {orderInfo.nom} {orderInfo.prenom}
          </p>
          <p>Phone Number: {orderInfo.numTele}</p>
          <p>Address: {orderInfo.address}</p>
          <p>Date: {orderInfo.date}</p>
          <p>Status: {orderInfo.status}</p>
          <p>Delivery Type: {orderInfo.typeLivraison}</p>
          <p>Total Order Price: {orderInfo.totalOrderPrice}DA</p>
          {orderInfo.note && <p>Note: {orderInfo.note}</p>}
        </div>
      )}
      <table className="order-detail-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.map((orderDetail) => (
            <tr key={orderDetail.idOrderline}>
              <td>{orderDetail.productName}</td>
              <td>x{orderDetail.quantity}</td>
              <td>{orderDetail.totalPrice}DA</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetail;
