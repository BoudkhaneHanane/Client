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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        if (response.data) {
          const product = {
            ...response.data,
            imageUrls: [
              response.data.image_url1,
              response.data.image_url2,
              response.data.image_url3,
              response.data.image_url4,
              response.data.image_url5
            ].filter(url => url !== null),
          };
          setProduct(product);
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

      // Modify the response data to include image URLs
      const productsWithImageUrl = response.data.map(product => ({
        ...product,
        imageUrl: product.image_path1 ? `/uploads/${product.image_path1}` : null
      }));

      setProductData(productsWithImageUrl);
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
            {product && product.imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Product ${index + 1}`}
                onClick={() => handleImageClick(imageUrl)}
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
