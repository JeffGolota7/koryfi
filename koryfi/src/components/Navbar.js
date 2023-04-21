import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import SearchBar from "./SearchBar";
import AccountIcon from "../components/AccountIcon.js";
import Cart from "../components/Cart.js";
import { ReactComponent as Logo } from "../icons/Koryfi Logo.svg";
import { IsMobile } from "../helpers/isMobile";

function Navbar() {
  const { currentUser } = useAuth();
  const [isHamOpen, toggleHamburger] = useState(false);
  const { cart } = useCart();
  const mobile = IsMobile();

  function handleHamburger() {
    if (isHamOpen) {
      toggleHamburger(false);
    } else {
      toggleHamburger(true);
    }
  }

  return (
    <>
      <nav className="navbar">
        <ul className="navbar-list">
          <Link to="/">
            <Logo />
          </Link>
          {!mobile ? (
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
          ) : (
            <>
              <div className="hamburger" onClick={handleHamburger}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
              <div
                className={`linksMobile ${isHamOpen ? "active" : "inactive"}`}
              >
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
                <SearchBar />
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/products">Products</Link>
                </li>

                <Cart />
              </div>
            </>
          )}
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
