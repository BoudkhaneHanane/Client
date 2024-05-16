import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AMD from "../../assets/AMD-pic.webp";
import Intel from "../../assets/Intel-pic.webp";
import "./listbuild.css";

function ListBuild({ selectedProcessor, setSelectedProducts }) {
  const [products, setProducts] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("Computer Cases");

  const handleComponentSelect = (component) => {
    if (component === "CPU Processors") {
      // Determine the appropriate component based on selectedProcessor
      const subsubcategorie =
        selectedProcessor === "AMD" ? "AMD CPUs" : "Intel CPUs";
      setSelectedComponent(subsubcategorie);
    } else {
      setSelectedComponent(component);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProducts((prevSelectedProducts) => [
      ...prevSelectedProducts,
      product,
    ]);

    switch (selectedComponent) {
      case "Computer Cases":
        setSelectedComponent("Motherboards");
        break;
      case "Motherboards":
        setSelectedComponent("Power Supply");
        break;
      case "Power Supply":
        setSelectedComponent("CPU Processors");
        break;
      case "CPU Processors":
        setSelectedComponent("CPU Cooler");
        break;
      case "CPU Cooler":
        setSelectedComponent("Memory");
        break;
      case "Memory":
        setSelectedComponent("Graphic Card");
        break;
      case "Graphic Card":
        setSelectedComponent("Storage");
        break;
      // Add cases for other components
      default:
        break;
    }
  };

  useEffect(() => {
    if (selectedComponent) {
      fetchProducts(selectedComponent, selectedProcessor); // Pass selectedProcessor
    }
  }, [selectedComponent, selectedProcessor]); // Add selectedProcessor to dependency array

  const fetchProducts = (selectedComponent, selectedProcessor) => {
    let subsubcategorie;

    if (selectedComponent === "Motherboards") {
      subsubcategorie = selectedProcessor === "AMD" ? "AMD" : "Intel";
    }

    fetch(
      `http://localhost:3001/listbuild/${selectedComponent}?selectedProcessor=${selectedProcessor}`
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(
              `Network response was not ok (${response.status} ${response.statusText}). Response body: ${text}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        // Filter products if subsubcategorie is defined
        if (subsubcategorie) {
          data = data.filter(
            (product) => product.namesubsubcategorie === subsubcategorie
          );
        }
        setProducts(data);
        console.log("Fetched products:", data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error.message);
        // Display error message to the user here
      });
  };

  return (
    <div className="listbuild-container col">
      <div className="box">
        <div className="picProcess">
          {selectedProcessor === "AMD" && <img src={AMD} alt="AMD" />}
          {selectedProcessor === "Intel" && <img src={Intel} alt="Intel" />}
        </div>
        <div className="mainProcess row">
          <div className="main-content">
            <h1>
              Build Your PC - {selectedProcessor} <br />
              Step - {selectedComponent}
            </h1>
            <div>
              {products.length > 0 ? (
                <ul>
                  {products.map((product, index) => (
                    <li key={index}>
                      <div className="row">
                        <img src={product.image_path1} alt={product.name} />
                        <div className="col">
                          <Link
                            to={`/detail/${product.idProduit}`}
                            className="link-no-underline"
                          >
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                          </Link>{" "}
                          <button onClick={() => handleProductSelect(product)}>
                            Select
                          </button>
                        </div>
                        <h3>{product.PrixRevendeur}DA</h3>
                        <h3> {product.price}DA</h3>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No products available for {selectedComponent}.</p>
              )}
            </div>
          </div>
          <div className="sidebar">
            <h2>Component :</h2>
            <ul className="cursor">
              <li onClick={() => handleComponentSelect("Computer Cases")}>
                Case
              </li>
              <li onClick={() => handleComponentSelect("Motherboards")}>
                Motherboard
              </li>
              <li onClick={() => handleComponentSelect("Power Supply")}>
                Power Supply
              </li>
              <li onClick={() => handleComponentSelect("CPU Processors")}>
                CPU
              </li>
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
            <Link to="/builtresult">
              <button>View Selected Products</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListBuild;
