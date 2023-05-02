import React from "react";
import { ReactComponent as Logo } from "../icons/Logo White.svg";
import { Outlet, Link } from "react-router-dom";
import { IsMobile } from "../helpers/isMobile.js";
import "../styles/Footer.css";

export default function Footer() {
  const mobile = IsMobile();
  return (
    <div className="footerContainer">
      <div className="footerContent">
        {!mobile ? (
          <>
            <div className="column first">
              <Logo />
              <Link to="/products">Products</Link>
              <Link to="/about">About</Link>
              <div>Contact Us</div>
              <div>FAQ</div>
            </div>
            <div className="column middle">
              <h2>Join our Newsletter!</h2>
              <div className="newsletterInput">
                <input type="text" placeholder="Enter Your Email" />
                <div className="subscribe">Subscribe</div>
              </div>
            </div>
            <div className="column last">
              <div>Terms of Service</div>
              <div>Privacy Policy</div>
            </div>
          </>
        ) : (
          <>
            <Logo />
            <div className="column middle">
              <h2>Join our Newsletter!</h2>
              <div className="newsletterInput">
                <input type="text" placeholder="Enter Your Email" />
                <div className="subscribe">Subscribe</div>
              </div>
            </div>
            <div className="column links">
              <div className="left">
                <Link to="/products">Products</Link>
                <Link to="/about">About</Link>
                <div>Contact Us</div>
              </div>
              <div className="right">
                <div>FAQ</div>
                <div>Terms of Service</div>
                <div>Privacy Policy</div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="bottomContent">
        <div className="column first">
          <h4>© 2023 Koryfi Sports Inc</h4>
        </div>
        <div className="column">
          <div className="iconList"></div>
        </div>
        <div className="column last">
          <h4>Made By Jeff Golota</h4>
        </div>
      </div>
    </div>
  );
}
