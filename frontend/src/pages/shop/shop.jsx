import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import GridViewIcon from "@mui/icons-material/GridView";
import Sidebar from "./sidebar";
import Product from "../../components/product";
import "./shop.css";

const Shop = ({ handleClick }) => {
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
        <div className="breadcrumb flex-column">
          <h1>Shop</h1>
          <ul className="list list-inline mb-0">
            <li className="list-inline-item">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="list-inline-item">
              <Link to={"/shop"}>Shop</Link>
            </li>
            <li className="list-inline-item">
              <Link to={"/"}>PC</Link>
            </li>
          </ul>
        </div>
        <div className="listingData">
          <div className="row">
            <div className="col-md-3 sidebarWrapper">
              <Sidebar />
            </div>
            <div className="col-md-6 rightContent homeproducts pt-0">
              <div className="topStrip d-flex align-items-center">
                <div className="ml-auto d-flex align-items-center">
                  <div className="tab_ mb-2 ml-3 position-relative">
                    <Button className="btn_">
                      <GridViewIcon />
                      Sort by: Featured
                    </Button>
                  </div>
                </div>
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
