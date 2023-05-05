import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as EditIcon } from "../icons/Edit-Icon.svg";
import { ReactComponent as CreditCardIcon } from "../icons/creditcard.svg";
import { ReactComponent as AddressIcon } from "../icons/house.svg";
import { useBannerContext } from "../contexts/BannerProvider.js";

import "../styles/Account.css";

export default function Account() {
  const { currentUser, logout, editDataField, addCardToAccount } = useAuth();
  const [isEditing, updateIsEditing] = useState(false);
  const [cardNumber, setCardNumber] = useState();
  const [expirationDate, setExpirationDate] = useState("");
  const [addCard, updateAddCard] = useState(false);
  const [addAddress, updateAddAddress] = useState(false);
  const navigate = useNavigate();
  const { setVisible, setMessage } = useBannerContext();

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const cardNumberRef = useRef();
  const csvRef = useRef();
  const expDateRef = useRef();

  async function handleLogout() {
    await logout()
      .then((auth) => {
        setMessage("Success");
        setVisible(true);
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
      setMessage("This value cannot be empty");
      setVisible(true);
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
            <div className="personalInfo">
              <h2 className="header">Personal Info</h2>
              <ul className="container">
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
            <div className="savedInformation">
              <h2 className="header">Your Saved Information</h2>
              <div className="container">
                <div className="addresses">
                  <h4>Shipping Addresses Saved</h4>
                  {currentUser.shippingAddresses &&
                  currentUser.shippingAddresses.length > 0 ? (
                    <div className="addresses">
                      {currentUser.shippingAddresses.map((address) => (
                        <div className="address">
                          <AddressIcon />
                          <h5 className="cardNumber">{address.address}</h5>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="noAddresses">
                      {!addAddress && (
                        <>
                          <h3 className="noAddressesTitle">
                            No addresses saved!
                          </h3>

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
                              <label className="inputLabel">
                                Security Code:
                              </label>
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
                            <label className="inputLabel">
                              Expiration Date:
                            </label>
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
                  <h4>Credit Cards Saved</h4>
                  {currentUser.paymentMethods &&
                  currentUser.paymentMethods.length > 0 ? (
                    <div className="paymentMethods">
                      {currentUser.paymentMethods.map((card) => (
                        <div className="paymentCard">
                          <CreditCardIcon />
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
                              <label className="inputLabel">
                                Security Code:
                              </label>
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
                            <label className="inputLabel">
                              Expiration Date:
                            </label>
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
            <div className="purchaseHistory">
              <h2 className="header">Purchase History</h2>
              <div className="container">
                {currentUser.purchaseHistory &&
                currentUser.purchaseHistory.length > 0 ? (
                  <>
                    <div className="purchase">
                      {currentUser.purchaseHistory.map((purchase) => (
                        <>
                          <h4>{`On ${purchase.date}:`}</h4>
                          <div className="product">
                            {purchase.itemsPurchased.map((product) => (
                              <>
                                <img src={product.images[0].lowRes} alt="" />
                                <div className="nameAndPrice">
                                  <h5>{product.name}</h5>
                                  <h4>{product.price}</h4>
                                </div>
                              </>
                            ))}
                          </div>
                        </>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h4>Looks like you haven't puchased anything!</h4>
                    <Link to="/products">
                      <button>Browse our Products</button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
