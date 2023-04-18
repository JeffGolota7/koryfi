import React, { useEffect, useRef } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Dropdown.css";

export default function Dropdown({ toggleIsOpen, type }) {
  const { cart, removeItem } = useCart();
  const { logout } = useAuth();
  // const accountDropdownRef = useRef(null);

  const navigate = useNavigate();

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

  // useOutsideClick(accountDropdownRef);
  return (
    <>
      {type === "cart" ? (
        <div className="dropdownContainer">
          <div className="cart">
            {cart !== undefined &&
              cart.map((item, index) => {
                return (
                  <li className="cartItem">
                    <img className="cartItemImg" src={item.images[0]} alt="" />
                    <div className="nameAndButton">
                      <h3 className="cartItemName">{item.name}</h3>
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
          <button className="checkOutButton">Check Out</button>
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
