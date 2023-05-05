import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/PostCheckout.css";

export default function PostCheckout() {
  const currentDate = new Date();
  const location = useLocation();
  const navigate = useNavigate();
  const businessDaysToAdd = 6;
  let count = 0;
  let date = currentDate;
  const { cart } = location.state;

  while (count < businessDaysToAdd) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      count++;
    }
  }

  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  return (
    <div className="postCheckout">
      <div className="content">
        <div className="postCheckoutHeader">
          <h1>The wait begins...</h1>
          <img
            className="previewImg"
            src={
              cart[0].category.includes("clothing")
                ? cart[0].images[0].images[0].lowRes
                : cart[0].images[0].lowRes
            }
            alt=""
          />
          <h2>{`Estimated Delivery: ${formattedDate}`}</h2>
        </div>
        <div className="postCheckoutFooter">
          <img
            className="checkoutImg"
            src="/images/illustrations/order confirm.png"
            alt=""
          />
          <h2>Don't let the fun end here...</h2>
          <div className="buttons">
            <button onClick={() => navigate("/products")}>
              Browse More Products
            </button>
            <button onClick={() => navigate("/")}>Return to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}
