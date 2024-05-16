import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MySlider from "../../components/myslider";
import Banner from "../../components/banner";
import Product from "../../components/product";
import Truck from "../../assets/truck.webp";
import Dollar from "../../assets/dollar.webp";
import Phone from "../../assets/phone.webp";
import Star from "../../assets/star.webp";
import Asus from "../../assets/asus.webp";
import { FaArrowRight } from "react-icons/fa";
import "./home.css";
import slide1 from "../../assets/photo_2024-05-16_20-12-14.jpg";
import slide2 from "../../assets/photo_2024-05-16_20-12-22.jpg";
import slide3 from "../../assets/photo_2024-05-16_20-12-26.jpg";
import slide4 from "../../assets/photo_2024-05-16_20-12-31.jpg";
import slide5 from "../../assets/photo_2024-05-16_20-12-35.jpg";
import slide6 from "../../assets/photo_2024-05-16_20-12-42.jpg";

function Home({ handleClick, showWarning, addToFavorites }) {
  const slides = [
    {
      id: 1,
      image: slide1,
      title: "Hi",
      description: "Description for Slide 1",
      button: {
        label: "Button 1",
        onClick: () => {
          console.log("Button 1 clicked!");
        },
      },
    },
    {
      id: 2,
      image: slide2,
      title: "Hello",
      description: "Description for Slide 2",
      button: {
        label: "Button 2",
        onClick: () => {
          console.log("Button 2 clicked!");
        },
      },
    },
    {
      id: 3,
      image: slide3,
      title: "Greetings",
      description: "Description for Slide 3",
      button: {
        label: "Button 3",
        onClick: () => {
          console.log("Button 3 clicked!");
        },
      },
    },
    {
      id: 4,
      image: slide4,
      title: "Hola",
      description: "Description for Slide 4",
      button: {
        label: "Button 4",
        onClick: () => {
          console.log("Button 4 clicked!");
        },
      },
    },
    {
      id: 5,
      image: slide5,
      title: "Hola",
      description: "Description for Slide 4",
      button: {
        label: "Button 4",
        onClick: () => {
          console.log("Button 4 clicked!");
        },
      },
    },
    {
      id: 6,
      image: slide6,
      title: "Hola",
      description: "Description for Slide 4",
      button: {
        label: "Button 4",
        onClick: () => {
          console.log("Button 4 clicked!");
        },
      },
    },
  ];

  const [productData, setProductData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/shop");
        const productsWithImageUrl = response.data.map((product) => ({
          ...product,
          imageUrl: product.image_path1
            ? `/uploads/${product.image_path1}`
            : null,
        }));
        setProductData(productsWithImageUrl);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  // Filter products with active promotions
  const specialOfferProducts = productData.filter(
    (product) => product.prixPromo && product.reduction
  );

  // Get the date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Filter new products excluding those with active promotions
  const newProducts = productData.filter((product) => {
    const createdAt = new Date(product.created_at);
    return (
      createdAt > thirtyDaysAgo &&
      !specialOfferProducts.some((p) => p.idProduit === product.idProduit)
    );
  });

  return (
    <>
      <MySlider slides={slides} />
      <div className="plusBoxes">
        <div className="row">
          <div className="col">
            <div>
              <img src={Truck} alt="" />
              <p>Fast Delivery</p>
            </div>
            <div>
              <img src={Dollar} alt="" />
              <p>CCP payment or Bank transfer</p>
            </div>
            <div>
              <img src={Phone} alt="" />
              <p>Great customer service</p>
            </div>
            <div>
              <img src={Asus} alt="" />
              <p>Partner of The World Leader ASUS</p>
            </div>
            <div>
              <img src={Star} alt="" />
              <p>+30 years of expertise at your service</p>
            </div>
          </div>
        </div>
      </div>
      <Banner />
      <section className="homeProducts">
        <div className="new">
          <div className="section">
            <label>New Products</label>
            <Link to="/shop" className="more">
              See All <FaArrowRight />
            </Link>
          </div>
          <div className="productRow">
            {newProducts.slice(0, 4).map((product) => (
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
        </div>{" "}
        <hr />
        <div className="new">
          <div className="section">
            <label>Special Offers</label>
            <Link to="/shop" className="more">
              See All <FaArrowRight />
            </Link>
          </div>
          <div className="productRow">
            {specialOfferProducts.slice(0, 4).map((product) => (
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
        <div className="pre">
          <div className="section">
            <label>Pre-Designed PCs</label>
            <Link to="/prebuilt" className="more">
              See All <FaArrowRight />
            </Link>
          </div>
          <div className="productRow">
            {productData
              .filter(
                (product) => product.namecategorie === "Predesigned computers"
              )
              .slice(0, 4) // Limit to 4 products
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
      </section>
    </>
  );
}

export default Home;
