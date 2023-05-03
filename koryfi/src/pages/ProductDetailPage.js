import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext.js";
import { IsMobile } from "../helpers/isMobile.js";
import { useProduct } from "../contexts/ProductContext.js";
import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as HalfStar } from "../icons/halfstar.svg";
import { ReactComponent as Star } from "../icons/fullstar.svg";
import { ReactComponent as StarOutline } from "../icons/fullstar outline.svg";
import { ReactComponent as HalfStarOutline } from "../icons/halfstar outline.svg";

import "../styles/ProductDetailPage.css";

export default function ProductDetailPage() {
  const { cart, setCart } = useCart();
  const { currentUser } = useAuth();
  const { addReview, products } = useProduct();
  const [isLoaded, setIsLoaded] = useState(false);
  const [reviewModal, toggleReviewModal] = useState(false);
  const [preloadImages, setPreloadImages] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [selectedStar, setSelectedStar] = useState(0);
  const location = useLocation();
  let { productObject } = location.state;
  const [product, updateProduct] = useState(productObject);
  const [activeImage, updateActiveImage] = useState(productObject.images[0]);
  const isMobile = IsMobile();

  useEffect(() => {
    if (typeof products !== "number" && products && product) {
      products.forEach((prod) => {
        if (product.id === prod.id) {
          console.log(prod);
          updateProduct(prod);
        }
      });
    }
  }, [products]);

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const descriptionRef = useRef();

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

  function handleReview() {
    if (reviewModal) {
      toggleReviewModal(false);
    } else {
      toggleReviewModal(true);
    }
  }

  function handleAddReview() {
    if (
      firstNameRef.current.value !== "" &&
      lastNameRef.current.value !== "" &&
      descriptionRef.current.value !== ""
    ) {
      const review = {
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        description: descriptionRef.current.value,
        rating: selectedStar + 1,
      };
      addReview(currentUser, product, review);
      toggleReviewModal(false);
    }
  }

  function handleStarHover(starIndex) {
    setHoveredStar(starIndex);
  }

  function handleStarClick(starIndex) {
    setSelectedStar(starIndex);
  }

  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStars = Math.round((rating - fullStars) * 2);

    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => (
          <span>
            <HalfStar className="normal" />
            <HalfStar className="flipped" />
          </span>
        ))}
        {[...Array(halfStars)].map((_, i) => (
          <span>
            <HalfStar className="normal" />
          </span>
        ))}
      </div>
    );
  }

  const aspectRatio = activeImage.highRes.width / activeImage.highRes.height;

  return (
    <div className="pdp-container">
      {reviewModal && (
        <div className="reviewModal">
          <div className="modalContent">
            <h1>Write a Review</h1>
            <h3>{`Rating: ${selectedStar + 1}/5`}</h3>
            {[...Array(5)].map((_, index) => {
              const isFilled = index <= (hoveredStar ?? selectedStar);
              return isFilled ? (
                <span>
                  <HalfStar
                    key={index}
                    onMouseEnter={() => handleStarHover(index)}
                    onClick={() => handleStarClick(index)}
                  />
                  <HalfStar
                    className="flipped"
                    key={index + 1}
                    onMouseEnter={() => handleStarHover(index)}
                    onClick={() => handleStarClick(index)}
                  />
                </span>
              ) : (
                <span>
                  <StarOutline
                    key={index}
                    onMouseEnter={() => handleStarHover(index)}
                    onClick={() => handleStarClick(index)}
                  />
                </span>
              );
            })}
            <div className="firstLast">
              <div className="first">
                <label htmlFor="">First Name</label>
                <input
                  ref={firstNameRef}
                  value={`${currentUser ? currentUser.firstName : ""}`}
                  type="text"
                />
              </div>
              <div className="last">
                <label htmlFor="">Last Name</label>
                <input
                  ref={lastNameRef}
                  value={`${currentUser ? currentUser.lastName : ""}`}
                  type="text"
                />
              </div>
            </div>
            <div className="description">
              <label htmlFor="">Description</label>
              <textarea
                ref={descriptionRef}
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <button onClick={handleAddReview}>Submit</button>
          </div>
        </div>
      )}

      <div className="product-information">
        <div className="images">
          <div className="img-wrapper zoom-container">
            {product.images && (
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
            )}
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
      <div className="reviews">
        <div className="heading">
          <h1>What have others said?</h1>
          <hr />
        </div>
        <div className="ratingStats">
          <div className="rating">
            <h3>Average Rating</h3>
            <div className="score">
              {`${product.avgRating ? product.avgRating.toString() : "--"}`}
              {product.avgRating && renderStars(product.avgRating)}
            </div>
          </div>
          <div className="rating">
            <h3>Total Ratings</h3>
            <div className="total">
              {product.reviews ? product.reviews.length : 0}
            </div>
          </div>
          <div className="rating">
            {currentUser && (
              <>
                <h3>Bought this before?</h3>
                <button className="giveRating" onClick={handleReview}>
                  Give a Rating
                </button>
              </>
            )}
          </div>
        </div>
        <hr />
        <div className="reviews">
          {product.reviews &&
            typeof product.reviews === "object" &&
            product.reviews.map((review) => (
              <div className="review">
                <div className="img"></div>
                <div className="content">
                  <h2>{`${review.firstName} ${review.lastName}`}</h2>
                  {renderStars(review.rating)}
                  <hr />
                  <p>{review.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
