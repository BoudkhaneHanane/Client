import React from "react";
import { Link } from "react-router-dom";

function BuiltResult({ selectedProducts = [], handleMoveAllToCart }) {
  return (
    <div className="build-result-container">
      <h1>Selected Products</h1>
      <ul>
        {selectedProducts.map((product) => (
          <li key={product.idProduit}>
            <h3>{product.name}</h3>
            <p>Price: {product.price}</p>
          </li>
        ))}
      </ul>
      <Link to="/cart">
        <button onClick={handleMoveAllToCart}>Move All to Cart</button>
      </Link>
    </div>
  );
}

export default BuiltResult;
