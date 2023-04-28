import React, { useState, useRef, useEffect } from "react";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ReactComponent as EditIcon } from "../icons/Edit-Icon.svg";

import "../styles/Account.css";

export default function Account() {
  const { currentUser, logout, editDataField, addCardToAccount } = useAuth();
  const [isEditing, updateIsEditing] = useState(false);
  const [cardNumber, setCardNumber] = useState();
  const [expirationDate, setExpirationDate] = useState("");
  const [addCard, updateAddCard] = useState(false);
  const [addAddress, updateAddAddress] = useState(false);
  const navigate = useNavigate();

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const cardNumberRef = useRef();
  const csvRef = useRef();
  const expDateRef = useRef();

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

  function handleAddCard() {
    const card = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      cardNumber: cardNumberRef.current.value,
      csv: csvRef.current.value,
      expDate: expDateRef.current.value,
    };

    addCardToAccount(currentUser, card);
  }

  const handleExpirationDateChange = (event) => {
    const { value } = event.target;

    let formattedExpirationDate = value;

    if (
      value.length === 2 &&
      value.charAt(1) !== "/" &&
      event.nativeEvent.inputType !== "deleteContentBackward"
    ) {
      formattedExpirationDate += "/";
    }

    setExpirationDate(formattedExpirationDate);
  };

  function editField(fieldName) {
    const field = document.querySelector(`.${fieldName}`);
    if (field.value !== "") {
      editDataField(currentUser, fieldName, field.value);
      updateIsEditing(false);
    } else {
      alert("this value cannot be empty");
    }
  }

  function handleCardNumberChange(event) {
    let inputVal = event.target.value;

    inputVal = inputVal.replace(/\D/g, "");

    let formattedCardNumber = inputVal.replace(
      /^(\d{4})(\d{4})(\d{4})(\d{1,4})$/,
      (_, p1, p2, p3, p4) => {
        return `${p1} ${p2} ${p3}${p4 ? " " : ""}${p4}`;
      }
    );

    setCardNumber(formattedCardNumber);
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
                  <div className="labelWrapper">
                    <label className="inputLabel">First Name:</label>
                    <EditIcon
                      onClick={() => {
                        if (!isEditing) {
                          updateIsEditing(true);
                        } else {
                          editField("firstName");
                        }
                      }}
                      className="editIcon"
                    />
                  </div>
                  {!isEditing ? (
                    <div className="field">
                      <span className="infoValue firstName">
                        {currentUser.firstName}
                      </span>
                    </div>
                  ) : (
                    <div className="field">
                      <input
                        autoFocus
                        className="infoValue firstName"
                        placeHolder={currentUser.firstName}
                      />
                    </div>
                  )}
                </li>
                <li className="infoField">
                  <div className="labelWrapper">
                    <label className="inputLabel">Last Name:</label>
                    <EditIcon
                      onClick={() => {
                        if (!isEditing) {
                          updateIsEditing(true);
                        } else {
                          editField("lastName");
                        }
                      }}
                      className="editIcon"
                    />
                  </div>
                  {!isEditing ? (
                    <div className="field">
                      <span className="infoValue lastName">
                        {currentUser.lastName}
                      </span>
                    </div>
                  ) : (
                    <div className="field">
                      <input
                        autoFocus
                        className="infoValue lastName"
                        placeHolder={currentUser.lastName}
                      />
                    </div>
                  )}
                </li>
                <li className="infoField">
                  <div className="labelWrapper">
                    <label className="inputLabel">Email:</label>
                    <EditIcon
                      onClick={() => {
                        if (!isEditing) {
                          updateIsEditing(true);
                        } else {
                          editField("email");
                        }
                      }}
                      className="editIcon"
                    />
                  </div>
                  {!isEditing ? (
                    <div className="field">
                      <span className="infoValue email">
                        {currentUser.email}
                      </span>
                    </div>
                  ) : (
                    <div className="field">
                      <input
                        autoFocus
                        className="infoValue email"
                        placeHolder={currentUser.email}
                        value={currentUser.email}
                      />
                    </div>
                  )}
                </li>
                <a className="resetPassword">Reset Password</a>
              </ul>
            </div>
            <div className="addresses">
              {currentUser.addresses && currentUser.addresses.length > 0 ? (
                <div className="addresses">
                  {currentUser.addresses.map((address) => (
                    <div className="address">
                      <h5 className="cardNumber">{address.address}</h5>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="noAddresses">
                  {!addAddress && (
                    <>
                      <h3 className="noAddressesTitle">No addresses saved!</h3>

                      <button onClick={() => updateAddCard(true)}>
                        Add an Address
                      </button>
                    </>
                  )}
                  {addAddress && (
                    <form className="addAddressForm">
                      <div className="firstLast">
                        <div className="first">
                          <label className="inputLabel">First Name:</label>
                          <div className="field">
                            <input
                              ref={firstNameRef}
                              className="infoValue firstName"
                              placeHolder={currentUser.firstName}
                            />
                          </div>
                        </div>
                        <div className="last">
                          <label className="inputLabel">Last Name:</label>
                          <div className="field">
                            <input
                              ref={lastNameRef}
                              className="infoValue lastName"
                              placeHolder={currentUser.lastName}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="numCSV">
                        <div className="num">
                          <label className="inputLabel">Card Number:</label>
                          <div className="field">
                            <input
                              maxLength={19}
                              ref={cardNumberRef}
                              className="infoValue cardNum"
                              type="tel"
                              pattern="\d{4} \d{4} \d{4} \d{1,4}"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              placeHolder={"**** **** **** ****"}
                            />
                          </div>
                        </div>
                        <div className="csv">
                          <label className="inputLabel">Security Code:</label>
                          <div className="field">
                            <input
                              maxLength={3}
                              ref={csvRef}
                              className="infoValue csv"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="expDate">
                        <label className="inputLabel">Expiration Date:</label>
                        <div className="field">
                          <input
                            maxLength={5}
                            ref={expDateRef}
                            value={expirationDate}
                            onChange={handleExpirationDateChange}
                            className="infoValue expDate"
                            placeHolder={"Month/Year"}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleAddCard();
                          updateAddCard(false);
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          updateAddCard(false);
                        }}
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
            <div className="payment">
              {currentUser.paymentMethods &&
              currentUser.paymentMethods.length > 0 ? (
                <div className="paymentMethods">
                  {currentUser.paymentMethods.map((card) => (
                    <div className="paymentCard">
                      {"Icon"}
                      <h5 className="cardNumber">{`Card ending in: ${card.cardNumber
                        .toString()
                        .substring(
                          card.cardNumber.toString().length - 4
                        )}`}</h5>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="noPaymentMethods">
                  {!addCard && (
                    <>
                      <h3 className="noMethodsTitle">
                        Looks as if you have no cards saved!
                      </h3>

                      <button onClick={() => updateAddCard(true)}>
                        Add a Card
                      </button>
                    </>
                  )}
                  {addCard && (
                    <form className="addCardForm">
                      <div className="firstLast">
                        <div className="first">
                          <label className="inputLabel">First Name:</label>
                          <div className="field">
                            <input
                              ref={firstNameRef}
                              className="infoValue firstName"
                              placeHolder={currentUser.firstName}
                            />
                          </div>
                        </div>
                        <div className="last">
                          <label className="inputLabel">Last Name:</label>
                          <div className="field">
                            <input
                              ref={lastNameRef}
                              className="infoValue lastName"
                              placeHolder={currentUser.lastName}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="numCSV">
                        <div className="num">
                          <label className="inputLabel">Card Number:</label>
                          <div className="field">
                            <input
                              maxLength={19}
                              ref={cardNumberRef}
                              className="infoValue cardNum"
                              type="tel"
                              pattern="\d{4} \d{4} \d{4} \d{1,4}"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              placeHolder={"**** **** **** ****"}
                            />
                          </div>
                        </div>
                        <div className="csv">
                          <label className="inputLabel">Security Code:</label>
                          <div className="field">
                            <input
                              maxLength={3}
                              ref={csvRef}
                              className="infoValue csv"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="expDate">
                        <label className="inputLabel">Expiration Date:</label>
                        <div className="field">
                          <input
                            maxLength={5}
                            ref={expDateRef}
                            value={expirationDate}
                            onChange={handleExpirationDateChange}
                            className="infoValue expDate"
                            placeHolder={"Month/Year"}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleAddCard();
                          updateAddCard(false);
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          updateAddCard(false);
                        }}
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
