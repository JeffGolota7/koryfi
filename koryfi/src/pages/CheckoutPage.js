import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import states from "../helpers/states.json";
import "../styles/CheckoutPage.css";

export default function CheckoutPage() {
  const { cart, removeItem, clearCart } = useCart();
  const { currentUser, addCardToAccount } = useAuth();
  const [cardNumber, setCardNumber] = useState();
  const [total, setTotal] = useState();
  const [expirationDate, setExpirationDate] = useState("");
  const [checkoutStage, updateStage] = useState(1);
  const [currentAddress, updateCurrentAddress] = useState();
  const [currentPayment, updateCurrentPayment] = useState();

  let saveCard = false;
  let saveAddress = false;

  const navigate = useNavigate();

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const cardNumberRef = useRef();
  const csvRef = useRef();
  const expDateRef = useRef();
  const saveCardRef = useRef();
  const saveAddressRef = useRef();

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

  function handlePaymentCard(card) {
    setCardNumber(card.cardNumber);
    setExpirationDate(card.expDate);
    updateCurrentPayment(card);
  }

  function handleStageChange(value) {
    if (checkoutStage === 1) {
      if (saveAddressRef.current.value) {
        saveAddress = true;
      }
    } else if (checkoutStage === 2) {
      if (saveCardRef.current.value) {
        saveCard = true;
      }
    }

    updateStage(checkoutStage + value);
  }

  function handleCheckout() {
    // Send Email
    clearCart();
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

  function handleAddressSelect(address) {
    updateCurrentAddress(address);
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
        <div
          className={`left-column ${checkoutStage === 3 ? "thirdStage" : ""}`}
        >
          {checkoutStage === 1 && (
            <>
              <div className="addressForm">
                <div className="heading">
                  <h1>Shipping Information</h1>
                </div>
                <hr></hr>
                <div className="addressSelect">
                  <label htmlFor="">Your Saved Addresses</label>
                  <div className="addresses">
                    {currentUser.shippingAddresses &&
                      currentUser.shippingAddresses.length > 0 &&
                      currentUser.shippingAddresses.map((address) => (
                        <div
                          className="address"
                          onClick={() => handleAddressSelect(address)}
                        >
                          <div className="name">
                            {`${address.firstName} ${address.lastName}`}
                          </div>
                          <div className="addressName">{address.address}</div>
                        </div>
                      ))}
                  </div>
                  <button
                    className="clear"
                    onClick={() => updateCurrentAddress(null)}
                  >
                    Clear All Fields
                  </button>
                </div>
                <div className="firstAndLast">
                  <div className="first input">
                    <label htmlFor="">First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={`${
                        currentAddress ? currentAddress.firstName : ""
                      }`}
                      required
                    />
                  </div>
                  <div className="last input">
                    <label htmlFor="">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={`${currentAddress ? currentAddress.lastName : ""}`}
                      required
                    />
                  </div>
                </div>
                <div className="email input">
                  <label htmlFor="">Email</label>
                  <input
                    type="text"
                    placeholder="Email Address"
                    value={`${currentAddress ? currentAddress.email : ""}`}
                    required
                  />
                </div>
                <div className="addressFields">
                  <div className="address input">
                    <label htmlFor="">Address</label>
                    <input
                      type="text"
                      placeholder="### (Street Name)"
                      value={`${currentAddress ? currentAddress.address : ""}`}
                      required
                    />
                  </div>
                  <div className="cityStateZip">
                    <div className="city input">
                      <label htmlFor="">City</label>
                      <input
                        type="text"
                        placeholder="City Name"
                        value={`${currentAddress ? currentAddress.city : ""}`}
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
                          currentAddress &&
                          currentAddress.state === state.abbreviation ? (
                            <option value={state.abbreviation} selected>
                              {state.abbreviation}
                            </option>
                          ) : (
                            <option value={state.abbreviation}>
                              {state.abbreviation}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="zip input">
                    <label htmlFor="">Zip Code</label>
                    <input
                      type="text"
                      placeholder="#####"
                      value={`${currentAddress ? currentAddress.zip : ""}`}
                      required
                    />
                  </div>
                  <div className="phone input">
                    <label htmlFor="">Phone Number</label>
                    <input
                      type="text"
                      placeholder="(###) ###-####"
                      value={`${currentAddress ? currentUser.phone : ""}`}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="saveAddress">
                <input
                  ref={saveAddressRef}
                  type="checkbox"
                  name="save"
                  id="saveAddress"
                />
                <label htmlFor="">Save address for future purchases?</label>
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
              <div className="heading">
                <h1>Payment Information</h1>
              </div>
              <hr></hr>
              {currentUser.paymentMethods.map((card) => (
                <div
                  className="paymentCard"
                  onClick={() => handlePaymentCard(card)}
                >
                  {"Icon"}
                  <h5 className="cardNumber">{`Card ending in: ${card.cardNumber
                    .toString()
                    .substring(card.cardNumber.toString().length - 4)}`}</h5>
                </div>
              ))}
              <div className="paymentForm">
                <form className="addCardForm">
                  <div className="firstLast">
                    <div className="firstNameContainer">
                      <label className="inputLabel">First Name:</label>
                      <input
                        ref={firstNameRef}
                        className="infoValue firstName"
                        placeholder="John"
                        value={currentPayment ? currentPayment.firstName : ""}
                      />
                    </div>
                    <div className="lastNameContainer">
                      <label className="inputLabel">Last Name:</label>
                      <input
                        ref={lastNameRef}
                        className="infoValue lastName"
                        placeholder="Smith"
                        value={currentPayment ? currentPayment.lastName : ""}
                      />
                    </div>
                  </div>
                  <div className="numCSV">
                    <div className="num">
                      <label className="inputLabel">Card Number:</label>
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
                    <div className="cvv">
                      <label className="inputLabel">Security Code:</label>
                      <input
                        maxLength={3}
                        ref={csvRef}
                        className="infoValue csv"
                        value={currentPayment ? currentPayment.csv : ""}
                      />
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
          {checkoutStage === 3 && (
            <>
              <h1>{"Now to make sure everything looks alright..."}</h1>
              <div className="cartPreview"></div>
              <div className="imgButton"></div>
            </>
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
                      <button
                        className="remove"
                        onClick={() => removeItem(index)}
                      >
                        X
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="summaryFooter">
              {total > 0 && checkoutStage === 3 && (
                <>
                  <h1>{`Total: ${total.toFixed(2)}`}</h1>
                  <Link to="/post-checkout" state={{ cart: cart }}>
                    <button
                      onClick={() => handleCheckout()}
                      className="placeOrder"
                    >
                      Place Your Order
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
