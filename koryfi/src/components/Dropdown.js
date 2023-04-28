import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Dropdown.css";

export default function Dropdown({ toggleIsOpen, type, parentRef }) {
  const { cart, removeItem, updateCount } = useCart();
  const { logout } = useAuth();
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.price * item.count;
    });
    setTotal(totalPrice);
  }, [cart]);

  async function handleLogout() {
    await logout()
      .then((auth) => {
        alert("Success!");
      })
      .catch((e) => {
        alert(e.message);
      });
    navigate("/");
  }

  return (
    <>
      {type === "cart" ? (
        <div className="dropdownContainer">
          <div className="cart">
            {cart !== undefined &&
              cart.map((item, index) => {
                return (
                  <li className="cartItem">
                    {item.images && (
                      <img
                        className="cartItemImg"
                        src={item.images[0].lowRes}
                        alt=""
                      />
                    )}

                    <div className="nameAndButton">
                      <div className="nameAndPrice">
                        <div className="name">
                          <h5 className="cartItemName">{item.name}</h5>
                          {item.count && (
                            <div className="count">
                              <h5 className="countAmount">x{item.count}</h5>
                            </div>
                          )}
                          <div className="countUpdate">
                            <span
                              className="minus"
                              onClick={() => updateCount(index, -1)}
                            >
                              -
                            </span>
                            <span
                              className="plus"
                              onClick={() => updateCount(index, 1)}
                            >
                              +
                            </span>
                          </div>
                        </div>
                        <h6 className="cartItemPrice">{item.price}</h6>
                      </div>
                      <div
                        className="remove"
                        onClick={() => {
                          removeItem(index);
                        }}
                      >
                        X
                      </div>
                    </div>
                  </li>
                );
              })}
          </div>
          <div className="total">{total > 0 && total}</div>
          <Link to="/checkout">
            <button
              className="checkOutButton"
              onClick={() => {
                toggleIsOpen(false);
              }}
            >
              Check Out
            </button>
          </Link>
        </div>
      ) : (
        <div className="dropdownContainer">
          <div
            onClick={() => {
              toggleIsOpen(false);
            }}
          >
            <Link to="/account">Account Settings</Link>
          </div>
          <div>
            <button className="button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
