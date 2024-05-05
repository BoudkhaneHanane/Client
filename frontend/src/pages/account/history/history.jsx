import React, { useState } from "react";

const History = () => {
  // Sample order data
  const [orders, setOrders] = useState([
    { id: 1, date: "2024-05-01", total: 100.0, items: ["Item 1", "Item 2"] },
    { id: 2, date: "2024-04-25", total: 75.0, items: ["Item 3", "Item 4"] },
    { id: 3, date: "2024-04-20", total: 50.0, items: ["Item 5"] },
  ]);

  return (
    <div>
      <h1>Order History</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>{order.items.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
