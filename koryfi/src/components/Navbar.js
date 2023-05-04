import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import SearchBar from "./SearchBar";
import AccountIcon from "../components/AccountIcon.js";
import Cart from "../components/Cart.js";
import { ReactComponent as Logo } from "../icons/Koryfi Logo.svg";
import { ReactComponent as IconAccount } from "../icons/Account-Icon.svg";
import { IsMobile } from "../helpers/isMobile";

function Navbar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isHamOpen, toggleHamburger] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { cart } = useCart();
  const mobile = IsMobile();

  function handleHamburger() {
    if (isHamOpen) {
      toggleHamburger(false);
    } else {
      toggleHamburger(true);
    }
  }

  useEffect(() => {
    function handleScroll() {
      const position =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setScrollPosition(position);
    }
    window.addEventListener("scroll", handleScroll, { capture: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarStyle = {
    backgroundColor: scrollPosition > 0 ? "#f8f8f8" : "transparent",
    transition: "background-color 0.5s ease-out",
  };

  return (
    <>
      <nav
        style={location.pathname === "/" ? navbarStyle : {}}
        className="navbar"
      >
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
              <div
                className="hamburger"
                id="hamburger"
                onClick={handleHamburger}
              >
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
              <div
                className={`linksMobile ${isHamOpen ? "active" : "inactive"}`}
              >
                {currentUser ? (
                  <>
                    <Link to="/account" onClick={handleHamburger}>
                      <IconAccount />
                    </Link>
                    {`${currentUser.firstName} ${currentUser.lastName}`}
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/sign-up" onClick={handleHamburger}>
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
                <SearchBar isHamOpen={isHamOpen} />
                <li>
                  <Link to="/about" onClick={handleHamburger}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/products" onClick={handleHamburger}>
                    Products
                  </Link>
                </li>

                <Link to="/checkout" onClick={handleHamburger}>
                  {`Your Cart (${cart.length})`}
                </Link>
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
