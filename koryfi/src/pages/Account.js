import React, { useState } from "react";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import "../styles/Account.css";

export default function Account() {
  const { currentUser, logout, editDataField } = useAuth();
  const [isEditing, updateIsEditing] = useState(false);
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

  function editField(fieldName) {
    const field = document.querySelector(`.${fieldName}`);
    if (field.value !== "") {
      editDataField(currentUser, fieldName, field.value);
      updateIsEditing(false);
    } else {
      alert("this value cannot be empty");
    }
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
            <div className="personalInfo">
              <h4>Personal Info</h4>
              <ul>
                <li className="infoField">
                  <label htmlFor="">First Name:</label>
                  {!isEditing ? (
                    <div className="field">
                      <span className="infoValue firstName">
                        {currentUser.firstName}
                      </span>
                      <div onClick={() => updateIsEditing(true)}>Edit</div>
                    </div>
                  ) : (
                    <div className="field">
                      <input
                        autoFocus
                        className="infoValue firstName"
                        placeHolder={currentUser.firstName}
                      />
                      <div onClick={() => editField("firstName")}>Done</div>
                    </div>
                  )}
                </li>
                <li className="infoField">
                  <label htmlFor="">Last Name:</label>
                  {!isEditing ? (
                    <div className="field">
                      <span className="infoValue lastName">
                        {currentUser.lastName}
                      </span>
                      <div onClick={() => updateIsEditing(true)}>Edit</div>
                    </div>
                  ) : (
                    <div className="field">
                      <input
                        autoFocus
                        className="infoValue lastName"
                        placeHolder={currentUser.lastName}
                      />
                      <div onClick={() => editField("lastName")}>Done</div>
                    </div>
                  )}
                </li>
                <li className="infoField">
                  <label htmlFor="">Email:</label>
                  {!isEditing ? (
                    <div className="field">
                      <span className="infoValue email">
                        {currentUser.email}
                      </span>
                      <div onClick={() => updateIsEditing(true)}>Edit</div>
                    </div>
                  ) : (
                    <div className="field">
                      <input
                        autoFocus
                        className="infoValue email"
                        placeHolder={currentUser.email}
                      />
                      <div onClick={() => editField("email")}>Done</div>
                    </div>
                  )}
                </li>
                <a href="">Reset Password</a>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
