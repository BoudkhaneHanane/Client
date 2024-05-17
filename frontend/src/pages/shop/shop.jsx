import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import GridViewIcon from "@mui/icons-material/GridView";
import Sidebar from "./sidebar";
import Product from "../../components/product";
import "./shop.css";

const Shop = ({ handleClick, addToFavorites }) => {
  const [productData, setProductData] = useState([]);
  const [error, setError] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sortByOption, setSortByOption] = useState("Featured");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        switch (sortByOption) {
          case "popularity":
            response = await axios.get("http://localhost:3001/shop");
            break;
          case "latest":
            response = await axios.get(
              "http://localhost:3001/shop?sortBy=latest"
            );
            break;
          case "price: low to high":
            response = await axios.get(
              "http://localhost:3001/shop?sortBy=priceLowToHigh"
            );
            break;
          case "price: high to low":
            response = await axios.get(
              "http://localhost:3001/shop?sortBy=priceHighToLow"
            );
            break;
          default:
            response = await axios.get("http://localhost:3001/shop");
        }

        const productsWithImageUrl = response.data.map((product) => ({
          ...product,
          imageUrl: product.image_path1
            ? `/uploads/${product.image_path1}`
            : null,
        }));
        setProductData(productsWithImageUrl);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, [sortByOption]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSortBy = (option) => {
    setSortByOption(option);
    setDropdownVisible(false); // Close the dropdown after selecting an option
  };

  return (
    <div className="listingData">
      <div className="row">
        <div className="sidebarWrapper">
          <Sidebar />
        </div>
        <div className="rightContent">
          <div className="features">
            <Button startIcon={<GridViewIcon />} onClick={toggleDropdown}>
              Sort by: {sortByOption}
            </Button>
            {dropdownVisible && (
              <ul ref={dropdownRef}>
                <li>
                  <Button onClick={() => handleSortBy("popularity")}>
                    Sort by popularity
                  </Button>
                </li>
                <li>
                  <Button onClick={() => handleSortBy("latest")}>
                    Sort by latest
                  </Button>
                </li>
                <li>
                  <Button onClick={() => handleSortBy("price: low to high")}>
                    Sort by price: low to high
                  </Button>
                </li>
                <li>
                  <Button onClick={() => handleSortBy("price: high to low")}>
                    Sort by price: high to low
                  </Button>
                </li>
              </ul>
            )}
          </div>
          <div className="productrow">
            {error && <div>Error: {error}</div>}
            {productData.length > 0 &&
              productData.map((product) => (
                <Product
                  key={product.idProduit}
                  product={product}
                  handleClick={handleClick}
                  addToFavorites={addToFavorites}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
