import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./pages/home/head/header";
import Home from "./pages/home/home";
import Cart from "./pages/panier/cart";
import Favoris from "./pages/favoris/favoris";
import Shop from "./pages/shop/shop";
import Detail from "./pages/details/productdetail";
import Checkout from "./pages/checkout/checkout";
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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

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

  return (
    <BrowserRouter>
      <Header sizeCart={cart.length} sizeFavoris={favorites.length} />
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
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
