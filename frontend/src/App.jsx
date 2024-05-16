import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./pages/home/head/header";
import Home from "./pages/home/home";
import Cart from "./pages/panier/cart";
import Favoris from "./pages/favoris/favoris";
import Shop from "./pages/shop/shop";
import BuildPC from "./pages/PCBuilder/PCBuilder";
import ListBuild from "./pages/PCBuilder/listbuild";
import BuiltResult from "./pages/PCBuilder/builtresult";
import PreBuilt from "./pages/prebuild/prebuild";
import Detail from "./pages/details/productdetail";
import Checkout from "./pages/checkout/checkout";
import Login from "./pages/account/sign/login";
import Sign from "./pages/account/sign/signRevendeur";
import History from "./pages/account/history/history";
import OrderDetail from "./pages/account/history/orderdetails";
import Pswrd from "./pages/account/sign/forgotPassword";
import Footer from "./pages/home/foot/footer";
import "./App.css";

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    return savedCart;
  });
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return savedFavorites;
  });

  const [showWarning, setShowWarning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleLogin = (nom, prenom, id) => {
    setIsAuthenticated(true);
    setNom(nom); // Assuming you have state variables for nom and prenom
    setPrenom(prenom);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleClick = (product) => {
    if (!product || typeof product !== "object" || !product.idProduit) {
      return;
    }

    const existingProductIndex = cart.findIndex(
      (item) => item.idProduit === product.idProduit
    );

    if (existingProductIndex !== -1) {
      setShowWarning(false);
      return;
    }

    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const addToFavorites = (product) => {
    if (!product || typeof product !== "object" || !product.idProduit) {
      return;
    }

    // Check if the product is already in favorites
    const isAlreadyFavorite = favorites.some(
      (item) => item.idProduit === product.idProduit
    );

    if (!isAlreadyFavorite) {
      setFavorites([...favorites, { ...product }]);
    }
  };
  const [selectedProcessor, setSelectedProcessor] = useState(null);

  const handleProcessorSelect = (processor) => {
    console.log("Selected processor:", processor);
    // Pass the selected processor to the ListBuild component
    setSelectedProcessor(processor);
  };

  const [selectedProducts, setSelectedProducts] = useState([]);
  console.log("Selected products:", selectedProducts);

  const handleMoveAllToCart = () => {
    // Add default quantity of 1 to each selected product and then add them to the cart
    const productsWithQuantity = selectedProducts.map((product) => ({
      ...product,
      quantity: 1,
    }));
    setCart((prevCart) => [...prevCart, ...productsWithQuantity]);
    setSelectedProducts([]); // Clear the selected products after moving them to the cart
  };

  return (
    <BrowserRouter>
      <Header
        sizeCart={cart.length}
        sizeFavoris={favorites.length}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              addToFavorites={addToFavorites}
              handleClick={handleClick}
              showWarning={showWarning}
            />
          }
        />
        <Route exact path="/settings" element={<Pswrd />} />
        <Route
          exact
          path="/sign"
          element={<Sign onLoginSuccess={handleLogin} />}
        />
        <Route
          exact
          path="/login"
          element={<Login onLoginSuccess={handleLogin} />}
        />
        <Route
          exact
          path="/history"
          element={<History nom={nom} prenom={prenom} />}
        />
        <Route exact path="/orderdetail/:orderId" element={<OrderDetail />} />
        <Route
          exact
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />
        <Route
          exact
          path="/favoris"
          element={
            <Favoris
              favorites={favorites}
              setFavorites={setFavorites}
              handleClick={handleClick}
              showWarning={showWarning}
            />
          }
        />
        <Route
          exact
          path="/shop"
          element={
            <Shop
              addToFavorites={addToFavorites}
              handleClick={handleClick}
              showWarning={showWarning}
            />
          }
        />
        <Route
          exact
          path="/detail/:id" // Add ":id" to specify that it's a parameter
          element={
            <Detail
              addToFavorites={addToFavorites}
              handleClick={handleClick}
              showWarning={showWarning}
            />
          }
        />
        <Route exact path="/checkout" element={<Checkout cart={cart} />} />
        <Route
          exact
          path="/buildpc"
          element={<BuildPC onSelectProcessor={handleProcessorSelect} />}
        />
        <Route
          exact
          path="/listbuild"
          element={
            <ListBuild
              setSelectedProducts={setSelectedProducts}
              selectedProducts={selectedProducts}
              selectedProcessor={selectedProcessor}
            />
          }
        />
        <Route
          exact
          path="/builtresult"
          element={
            <BuiltResult
              selectedProducts={selectedProducts}
              handleMoveAllToCart={handleMoveAllToCart}
            />
          }
        />
        <Route
          exact
          path="/prebuilt"
          element={
            <PreBuilt
              addToFavorites={addToFavorites}
              handleClick={handleClick}
              showWarning={showWarning}
            />
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
