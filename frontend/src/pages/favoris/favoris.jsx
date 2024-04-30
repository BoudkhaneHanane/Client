import React, { useState } from "react";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { FaTrash } from "react-icons/fa";
import "./favoris.css"; // Assuming the file name is favoris.css

const Favoris = ({ handleClick, showWarning, favorites, setFavorites }) => {
  // Function to remove an item from favorites
  const removeFromFavorites = (itemId) => {
    const updatedFavorites = favorites.filter((item) => {
      return item.id !== itemId;
    });
    setFavorites(updatedFavorites);
  };

  // Function to add item to cart from favorites
  const addToCart = (item) => {
    handleClick(item);
  };

  return (
    <div className="favorites-page">
      <label>Default WishList</label>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <table className="favorites-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Name</th>
              <th>Unit Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.image} alt={item.name} />
                </td>
                <td>
                  <Link to={`/products/${item.id}`}>{item.name}</Link>
                </td>
                <td>{item.price}DA</td>
                <td>
                  <button className="icon" onClick={() => addToCart(item)}>
                    <ShoppingCartIcon />
                  </button>
                  <button
                    className="icon"
                    onClick={() => removeFromFavorites(item.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Favoris;
