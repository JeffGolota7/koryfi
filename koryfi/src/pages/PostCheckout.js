import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    <>
      <img src={cart[0].images[0].lowRes} alt="" />
      <h2>{`Estimated Delivery: ${formattedDate}`}</h2>
      <img
        className="checkoutImg"
        src="/images/illustrations/order confirm.png"
        alt=""
      />
      <button>Browse</button>
      <button onClick={() => navigate("/")}>Return to Home</button>
    </>
  );
}
