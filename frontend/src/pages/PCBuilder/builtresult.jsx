import React from "react";
import { Link } from "react-router-dom";
import "./builtresult.css";

function BuiltResult({ selectedProducts = [], handleMoveAllToCart }) {
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
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: "100px", height: "auto" }} // Adjust dimensions as needed
                />
              </td>
              <td>{product.name}</td>
              <td className="price">{product.price} DA</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/cart">
        <div className="button" onClick={handleMoveAllToCart}>
          Move All to Cart⇥
        </div>
      </Link>
    </div>
  );
}

export default BuiltResult;
