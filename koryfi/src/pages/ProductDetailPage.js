import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext.js";
import { useProduct } from "../contexts/ProductContext.js";
import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as HalfStar } from "../icons/halfstar.svg";
import { ReactComponent as StarOutline } from "../icons/fullstar outline.svg";
import { useBannerContext } from "../contexts/BannerProvider.js";
import "../styles/ProductDetailPage.css";

export default function ProductDetailPage() {
  const { cart, setCart } = useCart();
  const { currentUser } = useAuth();
  const { setVisible, setMessage } = useBannerContext();
  const { addReview, products } = useProduct();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [reviewModal, toggleReviewModal] = useState(false);
  const [preloadImages, setPreloadImages] = useState(null);
  const [activeImageSet, updateActiveImageSet] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [selectedStar, setSelectedStar] = useState(0);
  const location = useLocation();
  let { productObject } = location.state;
  const [product, updateProduct] = useState(productObject);
  const [activeImage, updateActiveImage] = useState();

  useEffect(() => {
    if (typeof products !== "number" && products && product) {
      products.forEach((prod) => {
        if (product.id === prod.id) {
          updateProduct(prod);
        }
      });
    }
  }, [products]);

  useEffect(() => {
    if (productObject) {
      updateProduct(productObject);
      if (productObject.category.includes("clothing")) {
        updateActiveImage(productObject.images[0].images[0]);
        updateActiveImageSet(productObject.images[0].images);
      } else {
        updateActiveImage(productObject.images[0]);
        updateActiveImageSet(productObject.images);
      }
    }
  }, [productObject]);

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
      const prod = product;
      if (selectedSize) {
        prod.selectedSize = selectedSize;
      }
      if (selectedColor) {
        prod.selectedColor = selectedColor;
      }
      setMessage(`${prod.name} has been added to your cart!`);
      setVisible(true);
      setCart(prod);
    } else {
      setCart([{}]);
    }
  }

  useEffect(() => {
    if (product.category.includes("clothing")) {
      updateActiveImage(product.images[0].images[0]);
      updateActiveImageSet(product.images[0].images);
    } else {
      updateActiveImage(product.images[0]);
      updateActiveImageSet(product.images);
    }
    if (activeImageSet) {
      const imagesToPreload = activeImageSet.map((image) => image.highRes);
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
    }
  }, []);

  function handleImageLoad() {
    setIsLoaded(true);
  }

  function handleThumbnailClick(index) {
    setIsLoaded(false);
    updateActiveImage(activeImageSet[index]);
  }

  function handleColorClick(color, index) {
    const newColor = product.images.find((imgSet) => imgSet.color === color);
    updateActiveImageSet(newColor.images);
    updateActiveImage(newColor.images[0]);
    setSelectedColor(index);
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

  const aspectRatio =
    activeImage && activeImage.highRes.width / activeImage.highRes.height;

  return (
    <>
      {reviewModal && (
        <div className="reviewModal">
          <div className="modalContent">
            <div className="heading">
              <h1>Write a Review</h1>
              <div className="close" onClick={() => toggleReviewModal(false)}>
                X
              </div>
            </div>

            <h3>{`Rating: ${selectedStar + 1}/5`}</h3>
            <div onMouseLeave={() => setHoveredStar(null)}>
              {[...Array(5)].map((_, index) => {
                const isFilled = index <= (hoveredStar ?? selectedStar);
                return isFilled ? (
                  <span>
                    <HalfStar
                      className="star"
                      key={index}
                      onMouseEnter={() => handleStarHover(index)}
                      onClick={() => handleStarClick(index)}
                    />
                    <HalfStar
                      className="star flipped"
                      key={index + 1}
                      onMouseEnter={() => handleStarHover(index)}
                      onClick={() => handleStarClick(index)}
                    />
                  </span>
                ) : (
                  <span>
                    <StarOutline
                      className="star"
                      key={index}
                      onMouseEnter={() => handleStarHover(index)}
                      onClick={() => handleStarClick(index)}
                    />
                  </span>
                );
              })}
            </div>
            <div className="firstLast">
              <div className="first">
                <label htmlFor="">First Name</label>
                <input
                  ref={firstNameRef}
                  placeholder={`${currentUser ? currentUser.firstName : ""}`}
                  type="text"
                />
              </div>
              <div className="last">
                <label htmlFor="">Last Name</label>
                <input
                  ref={lastNameRef}
                  placeholder={`${currentUser ? currentUser.lastName : ""}`}
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
            <button onClick={() => handleAddReview()}>Submit</button>
          </div>
        </div>
      )}
      <div className="pdp-container">
        <div className="product-information">
          <div className="images">
            <div className="img-wrapper zoom-container">
              {activeImage && (
                <img
                  className="activeImage"
                  src={isLoaded ? activeImage.highRes : activeImage.lowRes}
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
              {activeImageSet &&
                activeImageSet.map((image, index) => (
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
              {(product.category === "snowboard" ||
                product.category === "skis") && (
                <h3 className="product-difficulty">{product.difficulty}</h3>
              )}
              <h2 className="product-name">{product.name}</h2>
              <h1 className="product-price">{`$${product.price}`}</h1>
              {product.avgRating && renderStars(product.avgRating)}
            </div>
            <hr />
            <div className="body">
              <p className="product-description">{product.description}</p>
              <div className="colorOptions optionContainer">
                {product.color &&
                  product.color.map((color, index) => (
                    <div
                      className={`option ${
                        selectedColor === index ? "selected" : ""
                      }`}
                      onClick={() => handleColorClick(color, index)}
                    >
                      {color}
                    </div>
                  ))}
              </div>
              <div className="sizeOptions optionContainer">
                {product.size &&
                  product.size.map((size, index) => (
                    <div
                      className={`option ${
                        selectedSize === index ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedSize(index);
                      }}
                    >
                      {size}
                    </div>
                  ))}
              </div>
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
              <p>
                {" "}
                Let's dive into the specifics of this board's stiffness or flex,
                bend, and shape. The stiffness of a snowboard is an essential
                aspect that determines the board's stability, responsiveness,
                and power. The flex rating of a snowboard determines how much
                give or resistance the board has when flexed. The bend of the
                board affects the board's profile and the way it interacts with
                the snow. Lastly, the shape of a snowboard determines how it
                performs in different types of terrain and snow conditions.
                Understanding these factors will help you make an informed
                decision about which snowboard is the best fit for you.
              </p>
              <h4 className="sizingChartHeader">Sizing Chart</h4>
              <table className="sizingChart" cellSpacing={0}>
                <thead>
                  <tr>
                    <th>Board Size</th>
                    <th>Weight (lbs)</th>
                    <th>Boot Size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>138</td>
                    <td>90-110</td>
                    <td>6-8</td>
                  </tr>
                  <tr>
                    <td>142</td>
                    <td>100-120</td>
                    <td>7-9</td>
                  </tr>
                  <tr>
                    <td>146</td>
                    <td>110-130</td>
                    <td>8-10</td>
                  </tr>
                  <tr>
                    <td>150</td>
                    <td>120-150</td>
                    <td>9-11</td>
                  </tr>
                  <tr>
                    <td>154</td>
                    <td>140-170</td>
                    <td>10-12</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="right-column">
              <div className="bend detail">
                <h3>Bend:</h3>
                <em>{product.bend}</em>
                <img src={`/images/snowboards/${product.bend}.svg`} alt="" />
              </div>
              <div className="flex detail">
                <h3>Flex Rating:</h3>
                <em>{product.flex}</em>
                <img src={`/images/snowboards/flex.svg`} alt="" />
              </div>
              <div className="shape detail">
                <h3>Shape:</h3>
                <em>{product.shape}</em>
                <img src={`/images/snowboards/shape.svg`} alt="" />
              </div>
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
            {product.reviews && typeof product.reviews === "object" ? (
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
              ))
            ) : (
              <div>
                <h3>Be the first to leave a review!</h3>
                {!currentUser && (
                  <Link to="/signup">
                    <button>Sign Up</button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
