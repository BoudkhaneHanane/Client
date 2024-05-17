import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import "./product.css";

const Product = ({ product, handleClick, addToFavorites }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [isInPromotion, setIsInPromotion] = useState(false);

  useEffect(() => {
    const checkPromotion = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/shop?Produit=${product.idProduit}`
        );
        setIsInPromotion(response.data.length > 0);
      } catch (error) {
        console.error("Error checking promotion:", error);
      }
    };

    checkPromotion();
  }, [product.idProduit]);

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
    addToFavorites(product);
  };

  const createdAtDate = new Date(product.created_at);
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return (
    <div className="productThumb" key={product.idProduit}>
      {showWarning && (
        <div className="warning">Product is already in the cart!</div>
      )}
      {createdAtDate > oneMonthAgo &&
        !product.prixPromo &&
        !product.reduction && <span className="badge">New</span>}
      {product.prixPromo && product.reduction && (
        <span className="promo">-{product.reduction}%</span>
      )}
      <div className="imgWrapper">
        <Link to={`/detail/${product.idProduit}`}>
          <img src={product.imageUrl} className="w-100" alt="Product" />
        </Link>
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
            </Link>
          </ul>
        </div>
      </div>
      <div className="info">
        <span className="categorie">
          {product.namecategorie}, {product.namesubcategorie}
        </span>
        <label>
          <Link to={`/detail/${product.idProduit}`}>{product.name}</Link>
        </label>
        <div className="price-wrapper">
          <div className="price-info">
            {product.prixPromo &&
              product.reduction &&
              new Date() <= new Date(product.dateFinPromo) && (
                <div>
                  <div className="price text-g font-weight-bold">
                    {product.prixPromo}DA
                  </div>
                  <div className="oldPrice">{product.price}DA</div>
                </div>
              )}
            {!product.prixPromo && !product.reduction && (
              <div className="price text-g font-weight-bold">
                {product.price}DA
              </div>
            )}
          </div>
          <Button className="transition" onClick={handleAddToCart}>
            Add to <ShoppingCartOutlinedIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Product;
