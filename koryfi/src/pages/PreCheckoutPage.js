import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

import "../styles/PreCheckoutPage.css";

export default function Checkout() {
  const { cart, removeItem, updateCount } = useCart();
  const [total, setTotal] = useState();

  useEffect(() => {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.price * item.count;
    });
    setTotal(totalPrice);
  }, [cart]);

  return (
    <div className="checkoutContainer">
      <div className="left-column">
        <div className="cartDisplay">
          <h1 className="cartHeader">Your Cart</h1>
          {cart.length > 0 ? (
            <ul className="cartList">
              {cart.map((item, index) => (
                <li className="cartItem">
                  {item.images && (
                    <img
                      className="cartItemImg"
                      src={
                        item.category.includes("clothing")
                          ? item.images[0].images[0].lowRes
                          : item.images[0].lowRes
                      }
                      alt=""
                    />
                  )}
                  <div className="nameAndButton">
                    <div className="nameAndPrice">
                      <div className="name">
                        <h3 className="cartItemName">{item.name}</h3>
                      </div>
                      <h3 className="cartItemPrice">${item.price}</h3>
                    </div>
                    <div className="buttons">
                      <div className="countUpdate">
                        <span
                          className="minus countButton"
                          onClick={() => updateCount(index, -1)}
                        >
                          -
                        </span>
                        {item.count && (
                          <h4 className="countAmount">x{item.count}</h4>
                        )}
                        <span
                          className="plus countButton"
                          onClick={() => updateCount(index, 1)}
                        >
                          +
                        </span>
                      </div>
                      <div className="removeUpdate">
                        <div
                          className="remove"
                          onClick={() => {
                            removeItem(index);
                          }}
                        >
                          X
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="emptyCart">
              <h2>Your Cart is Empty!</h2>

              <img
                src="/images/illustrations/empty-cart.png"
                className="emptyCartImg"
                alt=""
              />
              <Link to="/products">
                <button className="emptyBtn">Start Adding Some Items!</button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="right-column">
        <div className="summaryDisplay">
          <h2 className="summaryHeader">Order Summary</h2>
          <div className="summaryBody">
            <div className="totals">
              {cart.map((item) =>
                Array.from({ length: item.count }, (index) => (
                  <div key={index} className="summaryItem">
                    <h4>{item.name}</h4>
                    <h4>{item.price}</h4>
                  </div>
                ))
              )}
            </div>
          </div>
          {total > 0 ? (
            <>
              <h1>{`Total: ${total.toFixed(2)}`}</h1>
              <Link to="/checkout/confirm">
                <button className="continueCheckout">Checkout</button>
              </Link>
            </>
          ) : (
            <h4>Your Cart is Empty!</h4>
          )}
        </div>
      </div>
    </div>
  );
}
