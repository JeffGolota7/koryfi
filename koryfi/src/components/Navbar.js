import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <>
      <nav className="navbar">
        <ul className="navbar-list">
          <div className="logo">Koryfi Sports</div>
          <div className="links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/sign-up">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </div>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
