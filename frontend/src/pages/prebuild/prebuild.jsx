import React, { useState, useEffect } from "react";
import axios from "axios";
import PreBuilt from "../../assets/prebuilt.png";
import Product from "../../components/product";
import "./prebuild.css";

const PreBuild = ({ handleClick, showWarning, addToFavorites }) => {
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
    <div className="prebuild-container">
      <img src={PreBuilt} className="prebuild-image" alt="PreBuilt" />
      <div className="sii">
        <div className="product-list">
          {productData
            .filter(
              (product) => product.namecategorie === "Predesigned computers"
            )
            .map((product) => (
              <div className="item" key={product.idProduit}>
                <Product
                  handleClick={handleClick}
                  showWarning={showWarning}
                  addToFavorites={addToFavorites}
                  product={product}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PreBuild;
