import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext.js";

import "../styles/ProductDetailPage.css";

export default function ProductDetailPage() {
  const { cart, setCart } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const [preloadImages, setPreloadImages] = useState(null);
  const location = useLocation();
  const { product } = location.state;
  const [activeImage, updateActiveImage] = useState(product.images[0]);

  function handleMouseMove(e) {
    const img = e.target;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / img.width) * 100;
    const yPercent = (y / img.height) * 100;

    img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
  }

  function handleOnClick() {
    if (cart) {
      setCart(product);
    } else {
      setCart([{}]);
    }
  }

  useEffect(() => {
    const imagesToPreload = product.images.map((image) => image.highRes);
    const preloadImages = [];
    imagesToPreload.forEach((image) => {
      const img = new Image();
      img.src = image;
      preloadImages.push(img);
    });
    setPreloadImages(preloadImages);

    window.addEventListener("load", () => {
      setIsLoaded(true);
    });
  }, []);

  function handleImageLoad() {
    setIsLoaded(true);
  }

  function handleThumbnailClick(index) {
    setIsLoaded(false);
    updateActiveImage(product.images[index]);
  }

  const aspectRatio = activeImage.highRes.width / activeImage.highRes.height;

  return (
    <div className="pdp-container">
      <div className="product-information">
        <div className="images">
          <div className="img-wrapper zoom-container">
            <img
              className="activeImage"
              src={isLoaded ? activeImage.lowRes : activeImage.lowRes}
              srcSet={`${activeImage.lowRes} 500w, ${activeImage.highRes} 1000w`}
              sizes={`(max-width: ${aspectRatio * 500}px) 100vw, ${
                aspectRatio * 1000
              }px`}
              alt="Product Image"
              onMouseMove={handleMouseMove}
              onLoad={handleImageLoad}
            />
          </div>
          <div className="thumbnails">
            {product.images.map((image, index) => (
              <img
                src={image.lowRes}
                className="thumbnail"
                onClick={() => {
                  handleThumbnailClick(index);
                }}
              />
            ))}
          </div>
        </div>
        <div className="info">
          <div className="header">
            {product.category === "snowboard" && (
              <h3 className="product-difficulty">{product.difficulty}</h3>
            )}
            <h2 className="product-name">{product.name}</h2>
            <h1 className="product-price">{product.price}</h1>
            {/* Rating */}
          </div>
          <div className="body">
            <p className="product-description">{product.description}</p>
            {/* Sizes */}
            <button onClick={handleOnClick} className="addToCart">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {product.category === "snowboard" && (
        <div className="snowboard-info">
          <div className="left-column">
            <h2 className="header">Get to know it</h2>
            <p></p>
            <h4>Sizing Chart</h4>
            <table></table>
          </div>
          <div className="right-column">
            <h5>Camber Type:</h5>
            <em>{product.camber}</em>
            <img src="/images/snowboards/Camber.svg" alt="" />
          </div>
        </div>
      )}
    </div>
  );
}
