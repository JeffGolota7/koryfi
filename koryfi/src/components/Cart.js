import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as CartIcon } from "../icons/Cart.svg";
import { useCart } from "../contexts/CartContext.js";
import Dropdown from "./Dropdown";
import "../styles/Cart.css";

export default function Cart() {
  const [isOpen, toggleIsOpen] = useState(false);
  const { cart } = useCart();

  function toggleDropdown() {
    toggleIsOpen(!isOpen);
  }

  const cartDropdownRef = useRef(null);

  function useOutsideClick(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          toggleIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideClick(cartDropdownRef);
  return (
    <div className="cartContainer" ref={cartDropdownRef}>
      <div className="iconAndTotal">
        <CartIcon onClick={toggleDropdown} />
        {cart && cart.length > 0 && !isOpen && (
          <div className="badge">{cart.length}</div>
        )}
      </div>
      {isOpen && <Dropdown toggleIsOpen={toggleIsOpen} type="cart" />}
    </div>
  );
}
