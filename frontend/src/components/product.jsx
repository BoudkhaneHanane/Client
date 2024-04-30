import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Button from "@mui/material/Button";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Tooltip from "@mui/material/Tooltip";
import img from "../assets/pic1.webp";
import "./product.css";

const Product = ({ product, handleClick, addToFavorites }) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleAddToCart = () => {
    if (!product || !product.idProduit) {
      console.error("Invalid product:", product);
      return;
    }

    handleClick(product);
    setShowWarning(false); // Show the warning when adding to cart
  };

  const handleAddToFavorites = () => {
    if (!product || !product.idProduit) {
      console.error("Invalid product:", product);
      return;
    }

    addToFavorites(product); // Ensure addToFavorites is properly used
  };

  return (
    <div className="productThumb" key={product.idProduit}>
      {showWarning && (
        <div className="warning">Product is already in the cart!</div>
      )}
      <span className="badge">New</span>
      <div className="imgWrapper">
        <Link to={`/detail/${product.idProduit}`}>
          <img src={img} className="w-100" alt="Product" />
        </Link>{" "}
        <div className="overlay">
          <ul className="list list-inline mb-0">
            <li className="list-inline-item" onClick={handleAddToFavorites}>
              <Tooltip title="Add to Wishlist" placement="top">
                <span className="cursor">
                  <FavoriteBorderOutlinedIcon />
                </span>
              </Tooltip>
            </li>
            <Link to={`/detail/${product.idProduit}`}>
              <li className="list-inline-item">
                <Tooltip title="Quick View" placement="top">
                  <span className="cursor">
                    <RemoveRedEyeOutlinedIcon />
                  </span>
                </Tooltip>
              </li>
            </Link>{" "}
          </ul>
        </div>
      </div>
      <div className="info">
        <span className="d-block categorie">
          {product.namecategorie}, {product.namesubcategorie}
        </span>
        <label>
          <Link to={`/detail/${product.idProduit}`}>{product.name}</Link>{" "}
        </label>
        <div className="price-wrapper">
          <div className="price-info">
            <div className="price text-g font-weight-bold">
              {product.price}DA
            </div>
            <div className="oldPrice">200000.00DA</div>
          </div>
          <Button className="transition" onClick={handleAddToCart}>
            <ShoppingCartOutlinedIcon />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Product;
