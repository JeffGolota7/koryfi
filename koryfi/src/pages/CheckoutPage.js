import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import states from "../helpers/states.json";
import "../styles/CheckoutPage.css";

export default function CheckoutPage() {
  const { cart, removeItem, updateCount } = useCart();
  const { currentUser, addCardToAccount } = useAuth();
  const [cardNumber, setCardNumber] = useState();
  const [total, setTotal] = useState();
  const [expirationDate, setExpirationDate] = useState("");
  const [checkoutStage, updateStage] = useState(1);

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const cardNumberRef = useRef();
  const csvRef = useRef();
  const expDateRef = useRef();
  const saveCardRef = useRef();

  useEffect(() => {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.price * item.count;
    });
    setTotal(totalPrice);
  }, [cart]);

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

  function handleStageChange(value) {
    updateStage(checkoutStage + value);
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
    <div className="checkoutPageContainer">
      <div className="stage-progress">
        {/* Icon */}
        <div className={`backBtn ${checkoutStage === 1 && "inactive"}`}>
          <button
            onClick={() => {
              handleStageChange(-1);
            }}
          >
            Back
          </button>
        </div>
        <div className="progress">
          <div
            className={`dot ${
              (checkoutStage === 1 ||
                checkoutStage === 2 ||
                checkoutStage === 3) &&
              "active"
            }`}
          ></div>
          <div
            className={`line ${
              (checkoutStage === 2 || checkoutStage === 3) && "active"
            }`}
          ></div>
          <div
            className={`dot ${
              (checkoutStage === 2 || checkoutStage === 3) && "active"
            }`}
          ></div>
          <div className={`line ${checkoutStage === 3 && "active"}`}></div>
          <div className={`dot ${checkoutStage === 3 && "active"}`}></div>
        </div>
        <div className={`nextBtn ${checkoutStage === 3 && "inactive"}`}>
          <button
            onClick={() => {
              handleStageChange(1);
            }}
          >
            Next
          </button>
        </div>
      </div>
      <div className="checkoutPageContent">
        <div className="left-column">
          {checkoutStage === 1 && (
            <>
              <div className="addressForm">
                <div className="heading">
                  <h1>Shipping Information</h1>
                </div>
                <hr></hr>
                <div className="firstAndLast">
                  <div className="first input">
                    <label htmlFor="">First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={`${
                        currentUser && currentUser.firstName
                          ? currentUser.firstName
                          : ""
                      }`}
                      required
                    />
                  </div>
                  <div className="last input">
                    <label htmlFor="">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={`${
                        currentUser && currentUser.lastName
                          ? currentUser.lastName
                          : ""
                      }`}
                      required
                    />
                  </div>
                </div>
                <div className="email input">
                  <label htmlFor="">Email</label>
                  <input
                    type="text"
                    placeholder="Email"
                    value={`${
                      currentUser && currentUser.email ? currentUser.email : ""
                    }`}
                    required
                  />
                </div>
                <div className="addressFields">
                  {currentUser.addresses}
                  <div className="address input">
                    <label htmlFor="">Address</label>
                    <input
                      type="text"
                      placeholder="Address"
                      value={`${
                        currentUser && currentUser.address
                          ? currentUser.address
                          : ""
                      }`}
                      required
                    />
                  </div>
                  <div className="cityStateZip">
                    <div className="city input">
                      <label htmlFor="">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={`${
                          currentUser &&
                          currentUser.address &&
                          currentUser.address.city
                            ? currentUser.address.city
                            : ""
                        }`}
                        required
                      />
                    </div>
                    <div className="state input">
                      <select
                        placeholder="State"
                        className="stateSelect"
                        required
                      >
                        {states.map((state) =>
                          currentUser.address !== undefined &&
                          currentUser.address.state !== undefined &&
                          currentUser.address.state === state.abbreviation ? (
                            <option value={state.abbreviation} selected>
                              {state.name}
                            </option>
                          ) : (
                            <option value={state.abbreviation}>
                              {state.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="zip input">
                      <label htmlFor="">Zip Code</label>
                      <input
                        type="text"
                        placeholder="Zipcode"
                        value={`${
                          currentUser &&
                          currentUser.address &&
                          currentUser.address.zip
                            ? currentUser.address.zip
                            : ""
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="phone input">
                    <label htmlFor="">Phone Number</label>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={`${
                        currentUser && currentUser.phone
                          ? currentUser.phone
                          : ""
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="button">
                <button
                  className="continue"
                  onClick={() => {
                    handleStageChange(1);
                  }}
                >
                  Continue
                </button>
              </div>
            </>
          )}
          {checkoutStage === 2 && (
            <div>
              {currentUser.paymentMethods.map((card) => (
                <div className="paymentCard">
                  {"Icon"}
                  <h5 className="cardNumber">{`Card ending in: ${card.cardNumber
                    .toString()
                    .substring(card.cardNumber.toString().length - 4)}`}</h5>
                </div>
              ))}
              <div className="paymentForm">
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
                  <div className="saveCard">
                    <input
                      ref={saveCardRef}
                      type="checkbox"
                      name="save"
                      id="saveCard"
                    />
                    <label htmlFor="">Save card for future purchases?</label>
                  </div>
                  <div className="button">
                    <button
                      className="continue"
                      onClick={() => {
                        if (saveCardRef.current.value) {
                          handleAddCard();
                        }
                        handleStageChange(1);
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className="right-column">
          <div className="summaryDisplay">
            <h2 className="summaryHeader">Order Summary</h2>
            <div className="summaryBody">
              <div className="totals">
                {cart.map((item) =>
                  Array.from({ length: item.count }, (index) => (
                    <div key={index} className="summaryItem">
                      <h4>{item.name}</h4>
                      <h4>{item.price}</h4>
                    </div>
                  ))
                )}
              </div>
            </div>
            {total > 0 ? (
              <>
                <h1>{`Total: ${total.toFixed(2)}`}</h1>
                <Link to="/">
                  <button className="placeOrder">Place Your Order</button>
                </Link>
              </>
            ) : (
              <h4>Your Cart is Empty!</h4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
