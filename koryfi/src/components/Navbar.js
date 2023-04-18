import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import SearchBar from "./SearchBar";
import AccountIcon from "../components/AccountIcon.js";
import Cart from "../components/Cart.js";

function Navbar() {
  const { currentUser } = useAuth();
  const { cart } = useCart();

  return (
    <>
      <nav className="navbar">
        <ul className="navbar-list">
          <Link to="/">
            <img src="/images/Koryfi Logo.svg" alt="" />
          </Link>
          <div className="links">
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <SearchBar />

            {currentUser ? (
              <li>
                <AccountIcon className="accountIcon" />
              </li>
            ) : (
              <>
                <li>
                  <Link to="/sign-up">Sign Up</Link>
                </li>
              </>
            )}

            <Cart />
          </div>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
