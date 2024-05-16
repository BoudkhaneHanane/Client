import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./cart.css";

const Cart = ({ cart, setCart }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart data from localStorage when component mounts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Function to calculate the total price of items in the cart
  const calculateTotalPrice = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  // Function to handle deletion of an item from the cart
  const handleDeleteItem = (id) => {
    const updatedCart = cart.filter((item) => item.idProduit !== id);
    setCart(updatedCart);
  };


  
  // Function to handle changing quantity of an item in the cart
  const handleChangeQuantity = (id, newQuantity) => {
    // Ensure the new quantity is not negative
    newQuantity = Math.max(1, newQuantity);
    const updatedCart = cart.map((item) =>
      item.idProduit === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  // Update total price whenever cart changes
  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [cart]);

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <div>
          <p className="empty">Your cart is empty</p>
          <Link to="/shop">
            <button>Start Shopping</button>
          </Link>
        </div>
      ) : (
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Name</th>
                <th>Price per unit</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.idProduit}>
                  <td>
                    <img
                      src={item.imageUrl} // Assurez-vous que la propriété imageUrl est correcte
                      alt={item.name}
                    />
                  </td>
                  <td>
                    <p>{item.name}</p>
                  </td>
                  <td>{item.price}DA</td>
                  <td>
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          handleChangeQuantity(
                            item.idProduit,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleChangeQuantity(
                            item.idProduit,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    {item.price && item.quantity
                      ? item.price * item.quantity
                      : 0}
                    DA
                  </td>
                  <td>
                    <button
                      className="icon"
                      onClick={() => handleDeleteItem(item.idProduit)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="total-order-price">
            Total Order Price: {Number.isNaN(totalPrice) ? 0 : totalPrice}DA
          </p>
          <div className="buttons-container">
            <Link to="/shop">
              <button>⇤ Continue Shopping</button>
            </Link>
            <Link to="/checkout">
              <button>Checkout ⇥</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
