import React, { useState, useEffect } from "react";

function ListBuild({ selectedProcessor }) {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products when the selectedProcessor or selectedComponent changes
    fetchProducts(selectedProcessor, selectedComponent);
  }, [selectedProcessor, selectedComponent]);

  const fetchProducts = async (processorType, component) => {
    try {
      const response = await fetch(
        `/listbuild/${processorType}?component=${component}`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
    console.log("Adding products to build...");
  };

  return (
    <div className="listbuild-container">
      <div className="sidebar">
        <h2>Component Selection</h2>
        <ul>
          <li onClick={() => handleComponentSelect("Case")}>Case</li>
          <li onClick={() => handleComponentSelect("Power Supply")}>
            Power Supply
          </li>
          <li onClick={() => handleComponentSelect("Motherboard")}>
            Motherboard
          </li>
          <li onClick={() => handleComponentSelect("CPU")}>CPU</li>
          <li onClick={() => handleComponentSelect("CPU Cooler")}>
            CPU Cooler
          </li>
          <li onClick={() => handleComponentSelect("Memory")}>Memory</li>
          <li onClick={() => handleComponentSelect("Memory 2 (Optional)")}>
            Memory 2 (Optional)
          </li>
          <li onClick={() => handleComponentSelect("Graphic Card")}>
            Graphic Card
          </li>
          <li
            onClick={() => handleComponentSelect("Graphic Card 2 (Optional)")}
          >
            Graphic Card 2 (Optional)
          </li>
          <li onClick={() => handleComponentSelect("Storage Drive")}>
            Storage Drive
          </li>
          <li
            onClick={() => handleComponentSelect("Storage Drive 2 (Optional)")}
          >
            Storage Drive 2 (Optional)
          </li>
        </ul>
      </div>
      <div className="main-content">
        <h1>Build Your PC - {selectedProcessor}</h1>
        <div>
          <h2>Available Products</h2>
          <div>
            {products.map((product) => (
              <div key={product.idProduit}>
                <h3>{product.name}</h3>
                <p>Brand: {product.brand}</p>
                <p>Price: {product.price}DA</p>
                <p>{product.description}</p>
              </div>
            ))}
            <button onClick={() => handleAddToBuild(selectedProcessor)}>
              Add to Build
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListBuild;
