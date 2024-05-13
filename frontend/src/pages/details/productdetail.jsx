import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Product from "../../components/product";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import "./productdetail.css";

const ProductDetails = ({ addToFavorites, handleClick, cart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState([]);
  const [error, setError] = useState(null);
  const [clickedImage, setClickedImage] = useState(null);

  const handleImageClick = (photo) => {
    setClickedImage(photo);
  };

  const handleAddToCart = () => {
    if (!product || !product.idProduit) {
      console.error("Invalid product:", product);
      return;
    }

    handleClick(product);
    setShowWarning(false);
  };

  const handleAddToWishlist = () => {
    if (!product || !product.idProduit) {
      console.error("Invalid product:", product);
      return;
    }

    addToFavorites(product);
  };

  const productes = {
    photos: [
      "https://mldrnrb5hiun.i.optimole.com/w:100/h:100/q:mauto/rt:fill/g:ce/f:best/https://www.chinformatique.dz/wp-content/uploads/2022/01/4-25.png",
      "https://mldrnrb5hiun.i.optimole.com/w:100/h:100/q:mauto/rt:fill/g:ce/f:best/https://www.chinformatique.dz/wp-content/uploads/2022/01/2-27.png",
      "https://mldrnrb5hiun.i.optimole.com/w:100/h:100/q:mauto/rt:fill/g:ce/f:best/https://www.chinformatique.dz/wp-content/uploads/2022/01/3-26.png",
      "https://mldrnrb5hiun.i.optimole.com/w:100/h:100/q:mauto/rt:fill/g:ce/f:best/https://www.chinformatique.dz/wp-content/uploads/2022/01/5-24.png",
      "https://mldrnrb5hiun.i.optimole.com/w:100/h:100/q:mauto/rt:fill/g:ce/f:best/https://www.chinformatique.dz/wp-content/uploads/2022/01/6-23.png",
      "https://mldrnrb5hiun.i.optimole.com/w:100/h:100/q:mauto/rt:fill/g:ce/f:best/https://www.chinformatique.dz/wp-content/uploads/2022/01/7-21.png",
      "https://mldrnrb5hiun.i.optimole.com/w:100/h:100/q:mauto/rt:fill/g:ce/f:best/https://www.chinformatique.dz/wp-content/uploads/2022/01/1-31.png",
    ],
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/products/${id}`
        );
        if (response.data) {
          setProduct(response.data);
          setError(null);
        } else {
          setProduct(null);
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
        setError("Failed to fetch product");
      }
    };

    fetchProduct();
  }, [id]);

  const fetchRelatedProducts = async () => {
    if (!product) {
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/products/related/${product.namecategorie}`
      );
      setProductData(response.data);
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  };

  useEffect(() => {
    fetchRelatedProducts();
  }, [product?.namecategorie]);

  return (
    <div className="single-product-page">
      <div className="row">
        <div className="pics col">
          <div className="enlarged-image">
            {clickedImage && <img src={clickedImage} alt="Enlarged Product" />}
          </div>
          <div className="product-photos">
            {productes.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Product ${index + 1}`}
                onClick={() => handleImageClick(photo)}
              />
            ))}
          </div>
        </div>
        {error && <div>Error: {error}</div>}
        {product && (
          <div className="product-details">
            <h1>{product.name}</h1>
            <hr />
            <h3>{product.price}DA</h3>
            <p>{product.description}</p>
            <hr />
            <h2>
              Categories: {product.namecategorie},{product.namesubcategorie},
              {product.namesubsubcategorie}
            </h2>
            <div onClick={handleAddToWishlist}>
              <FavoriteBorderOutlinedIcon />
              <h2>Add To WishList</h2>
            </div>
            <button onClick={handleAddToCart}>
              Add To <ShoppingCartOutlinedIcon />
            </button>
            <hr />
          </div>
        )}
      </div>
      <div className="related-products">
        <h2>Related Products</h2>
        <hr />
        <div className="productrow">
          {error && <div>Error: {error}</div>}
          {productData.length > 0 &&
            productData
              .filter(
                (relatedProduct) => relatedProduct.idProduit !== parseInt(id)
              )
              .slice(0, 4)
              .map((product) => (
                <Product
                  key={product.idProduit}
                  product={product}
                  handleClick={handleClick}
                  addToFavorites={addToFavorites}
                  cart={cart}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
