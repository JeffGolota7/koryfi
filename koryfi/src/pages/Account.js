import React from "react";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import "../styles/Account.css";

export default function Account() {
  const { currentUser, logout } = useAuth();
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
  return (
    <>
      <div className="accountWrapper">
        <div className="accountCard">
          <div className="leftSide">
            <h2>Hey There, {currentUser.firstName}</h2>
            <button onClick={handleLogout}>Log Out</button>
          </div>
          <div className="rightSide">
            <h2>Account Settings</h2>
            <ul>
              <li>First Name: {currentUser.firstName}</li>
              <li>Last Name: {currentUser.lastName}</li>
              <li>Email: {currentUser.email}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
