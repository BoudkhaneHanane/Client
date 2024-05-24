import React from "react";
import { Link } from "react-router-dom";
import "./builtresult.css";

function BuiltResult({ selectedProducts = [], handleMoveAllToCart }) {
  const handleMoveToCart = () => {
    handleMoveAllToCart(selectedProducts);
  };

  return (
    <div className="build-result-container">
      <h1>Selected Products</h1>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product) => (
            <tr key={product.idProduit}>
              <td>
                <img
                  src={`/uploads/${product.image_path1}`}
                  alt={product.name}
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td>{product.name}</td>
              <td className="price">{product.price} DA</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/cart">
        <h1 className="button" onClick={handleMoveToCart}>
          Move All to Cart⇥
        </h1>
      </Link>
    </div>
  );
}

export default BuiltResult;
