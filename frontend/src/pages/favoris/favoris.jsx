import React from "react";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { FaTrash } from "react-icons/fa";
import "./favoris.css";

const Favoris = ({ handleClick, favorites, setFavorites }) => {
  const handleAddToCart = (product) => {
    handleClick(product); // Call addToCart function with the selected product
  };

  const handleDeleteItem = (productId) => {
    // Remove the item from favorites
    const updatedWishlist = favorites.filter(
      (item) => item.idProduit !== productId
    );
    setFavorites(updatedWishlist);
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
              <tr key={item.idProduit}>
                <td>
                  <img src={item.imageUrl} alt={item.name} /> {/* Display image */}
                </td>
                <td >
                  <Link className="name" to={`/detail/${item.idProduit}`}>{item.name}</Link>
                </td>
                <td>{item.price}DA</td>
                <td>
                  <div className="table-icones">
                    <button
                      className="icon"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCartIcon />
                    </button>
                    <button
                      className="icons"
                      onClick={() => handleDeleteItem(item.idProduit)}
                    >
                      <FaTrash />
                    </button>
                  </div>
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
