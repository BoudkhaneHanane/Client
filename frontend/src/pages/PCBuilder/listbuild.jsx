import React, { useState, useEffect } from "react";
import AMD from "../../assets/AMD-pic.webp";
import Intel from "../../assets/Intel-pic.webp";

function ListBuild({ selectedProcessor }) {
  const [products, setProducts] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("");

  const handleComponentSelect = (component) => {
    if (component === "Motherboard") {
      setSelectedComponent("Motherboard");
    } else if (component === "CPU") {
      // Determine the appropriate subsubcategorie based on selectedProcessor
      const subsubcategorie =
        selectedProcessor === "AMD" ? "AMD CPUs" : "Intel CPUs";
      setSelectedComponent(subsubcategorie);
    } else {
      setSelectedComponent(component);
    }
  };

  useEffect(() => {
    if (selectedComponent) {
      fetchProducts(selectedComponent);
    }
  }, [selectedComponent]);

  const fetchProducts = (selectedComponent) => {
    fetch(`/listbuild/${selectedComponent}`)
      .then((response) => {
        if (!response.ok) {
          // Si la réponse n'est pas dans la plage de statuts 200-299
          return response.text().then((text) => {
            throw new Error(
              `Network response was not ok (${response.status} ${response.statusText}). Response body: ${text}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        console.log("Fetched products:", data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error.message);
        // Affichez un message d'erreur à l'utilisateur ici
      });
  };

  return (
    <div className="listbuild-container col">
      <div className="picProcess">
        {selectedProcessor === "AMD" && <img src={AMD} alt="AMD" />}
        {selectedProcessor === "Intel" && <img src={Intel} alt="Intel" />}
      </div>
      <div className="mainProcess row">
        <div className="main-content">
          <h1>Build Your PC - {selectedProcessor}</h1>
          <div>
            {products.length > 0 ? (
              <ul>
                {products.map((product, index) => (
                  <li key={index}>{product.name}</li>
                ))}
              </ul>
            ) : (
              <p>No products available for {selectedComponent}.</p>
            )}
          </div>
        </div>
        <div className="sidebar">
          <h2>Component Selection</h2>
          <ul className="cursor">
            <li onClick={() => handleComponentSelect("Computer Cases")}>
              Case
            </li>
            <li onClick={() => handleComponentSelect("Motherboard")}>
              Motherboard
            </li>
            <li onClick={() => handleComponentSelect("Power Supply")}>
              Power Supply
            </li>
            <li onClick={() => handleComponentSelect("CPU")}>CPU</li>
            <li onClick={() => handleComponentSelect("CPU Cooler")}>
              CPU Cooler
            </li>
            <li onClick={() => handleComponentSelect("Memory")}>Memory</li>
            <li onClick={() => handleComponentSelect("Memory")}>
              Memory 2 (Optional)
            </li>
            <li onClick={() => handleComponentSelect("Graphic Card")}>
              Graphic Card
            </li>
            <li onClick={() => handleComponentSelect("Graphic Card")}>
              Graphic Card 2 (Optional)
            </li>
            <li onClick={() => handleComponentSelect("Storage")}>
              Storage Drive
            </li>
            <li onClick={() => handleComponentSelect("Storage")}>
              Storage Drive 2 (Optional)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ListBuild;
