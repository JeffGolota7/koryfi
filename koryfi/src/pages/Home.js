import React, { useState, useEffect } from "react";
import { useProduct } from "../contexts/ProductContext.js";
import { Link } from "react-router-dom";
import { ReactComponent as Effect } from "../icons/Effect.svg";
import "../styles/Home.css";

export default function Home() {
  const products = useProduct();
  const [currentImgIndex, updateCurrentImgIndex] = useState(0);

  const carousel = [
    {
      header: "Let Us Help You REACH YOUR PEAK",
      btnText: "Shop Now",
      className: "landing",
      img: "./images/homepage.png",
    },
    { header: "<h1>test</h1>", img: "./images/homepage.png" },
    { header: "<h1>test</h1>", img: "./images/homepage.png" },
  ];

  function handleCarousel() {
    if (currentImgIndex === carousel.length - 1) {
      updateCurrentImgIndex(0);
    } else {
      updateCurrentImgIndex(currentImgIndex + 1);
    }
  }

  function chooseTopPicks() {
    if (products.products !== undefined) {
      const shuffled = products.products.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 6);
      return selected.map((item) => (
        <Link to="/product-information" state={{ productObject: item }}>
          <div className="card">
            {!item.category.includes("clothing") ? (
              item.images.length > 0 ? (
                <img src={item.images[0].lowRes} alt="" />
              ) : (
                <div className="noPhoto">no photo</div>
              )
            ) : item.images.length > 0 ? (
              <img src={item.images[0].images[0].lowRes} alt="" />
            ) : (
              <div className="noPhoto">no photo</div>
            )}

            <div className="textAndButton">
              <div className="nameAndPrice">
                <h2>{item.name}</h2>
                <h4>{item.price}</h4>
              </div>
              <button>View Details</button>
            </div>
          </div>
        </Link>
      ));
    }
  }

  useEffect(() => {
    // setInterval(handleCarousel, 10000);
  });
  return (
    <div>
      <div className="hero">
        <img className="heroImg" src={carousel[currentImgIndex].img} alt="" />

        <div className="text">
          {currentImgIndex === 0 && (
            <div className="landingText">
              <h4>Let Us Help You</h4>
              <h3>
                REACH YOUR <span>PEAK</span>
              </h3>
            </div>
          )}

          <Link to="/products">
            <button className="heroButton">
              {carousel[currentImgIndex].btnText}
            </button>
          </Link>
        </div>
      </div>

      <div className="topPicks">
        <h2 className="topPicksHeader">Top Picks</h2>
        <div className="topPicksGrid">{chooseTopPicks()}</div>
      </div>

      <div className="whoWeAre">
        <div className="left-column">
          <h1 className="header">
            Who <br />
            <span>We Are</span>
          </h1>
          <img src="./images/whoweare.png" alt="" />
        </div>
        <div className="right-column">
          <div className="aboutContent">
            <p className="text">
              Koryfi was founded in 2020 by a group of snow sports enthusiasts
              who wanted to bring high-quality gear and apparel to fellow
              enthusiasts. Our mission is to provide the best gear and apparel
              for people and make it accessible to everyone. Our values are
              rooted in the thrill of adventure, passion for the mountains and
              the love of the sport. We are committed to providing excellent
              customer service and being a responsible and sustainable company.
            </p>
            <div className="bottom">
              <div className="stripe">Don't Believe Us?</div>
              <button>Reac our Journey</button>
            </div>
          </div>
        </div>
      </div>
      <div className="testimonials">
        <Effect className="effect" />
        <div className="testimonialsContainer">
          <div className="headingContainer">
            <h3 className="heading">
              Hear from our <br />
              Satisfied Customers
            </h3>
            <div className="quote">“</div>
          </div>
          <div className="testimonialContent">
            <div className="testimonialCard">
              <p className="text">
                "Amazing products! The skis I purchased were top of the line and
                made my skiing experience so much better. Thanks, Koryfi!"
              </p>
              <h4 className="name">John Smith</h4>
            </div>
            <div className="testimonialCard">
              <p className="text">
                "I was skeptical about ordering snow gear online, but Koryfi's
                easy-to-use website and fast shipping made the process a breeze.
                I'll definitely be a returning customer."
              </p>
              <h4 className="name">Emily Jones</h4>
            </div>
            <div className="testimonialCard">
              <p className="text">
                "The customer service at Koryfi is outstanding. I had a question
                about sizing and their team was extremely helpful in finding me
                the perfect fit. Thank you, Koryfi!"
              </p>
              <h4 className="name">Michael Lee</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
