import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/shop");
        setProductData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  return (
    <section className="listingPage">
      <div className="">
        <div className="listingData">
          <div className="row">
            <div className="sidebarWrapper">
              <Sidebar />
            </div>
            <div className="rightContent">
              <div className="features">
                <button>
                  <GridViewIcon />
                  Sort by: Featured
                </button>
                <ul>
                  <li>
                    <button>Sort by popularity</button>
                  </li>
                  <li>
                    <button>Sort by latest</button>
                  </li>
                  <li>
                    <button>Sort by price: low to high</button>
                  </li>
                  <li>
                    <button>Sort by price: high to low</button>
                  </li>
                </ul>
              </div>
              <div className="productrow">
                <div className="item">
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
        </div>
      </div>
    </section>
  );
};

export default Shop;
