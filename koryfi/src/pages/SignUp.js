import React, { useState, useRef } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, collection } from "firebase/firestore";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import { codeToMessage } from "../helpers/errorHandling";

import "../styles/SignUp.css";
import "../styles/Form.css";
import Banner from "../components/Banner";

function SignUp() {
  const [isLoading, setLoading] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [message, updateMessage] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const phoneRef = useRef();
  const confirmPasswordRef = useRef();
  const { signup, currentUser } = useAuth();
  const navigate = useNavigate();

  function showError(code) {
    updateMessage(codeToMessage(code));
    setVisible(true);
  }

  const register = async (e) => {
    e.preventDefault();
    if (
      emailRef.current.value !== "" &&
      passwordRef.current.value !== "" &&
      passwordRef.current.value === confirmPasswordRef.current.value
    ) {
      setLoading(true);
      try {
        await signup(emailRef.current.value, passwordRef.current.value)
          .then(async (auth) => {
            await setDoc(doc(db, "users", auth.user.uid), {
              firstName: firstNameRef.current.value,
              lastName: lastNameRef.current.value,
              email: emailRef.current.value,
              phone: phoneRef.current.value,
              password: passwordRef.current.value,
            })
              .then(() => {
                alert("success!");
              })
              .catch((e) => {
                updateMessage(e.message);
                setVisible(true);
              });
          })
          .then(() => {
            navigate("/");
          });
      } catch (e) {
        showError(e.code);
      }
      setLoading(false);
    } else {
      alert("User Name and/or Password Cannot be Blank!");
    }
  };

  function handleTest() {
    setVisible(true);
    // sendSignUpEmail(emailRef.current.value);
  }
  return (
    <div className="formWrapper">
      <Banner
        message={message}
        duration={3000}
        isVisible={isVisible}
        setVisible={setVisible}
      ></Banner>
      <button onClick={handleTest}>Test</button>
      <div className="formCard">
        <div className="leftSide">
          <h2>Join Us</h2>
        </div>
        <div className="rightSide">
          <form className="signupForm" onSubmit={register}>
            <div id="name">
              <div className="first input">
                <label>First Name</label>
                <input ref={firstNameRef} type="text" required />
              </div>
              <div className="last input">
                <label>Last Name</label>
                <input ref={lastNameRef} type="text" required />
              </div>
            </div>
            <div id="email" className="input">
              <label>Email</label>
              <input ref={emailRef} type="email" required />
            </div>
            <div id="password" className="input">
              <label>Password</label>
              <input ref={passwordRef} type="password" required />
            </div>
            <div id="password" className="input">
              <label>Confirm Password</label>
              <input ref={confirmPasswordRef} type="password" required />
            </div>
            <div id="phone" className="input">
              <label>Phone Number</label>
              <input ref={phoneRef} type="tel" required />
            </div>
            <button disabled={isLoading} type="submit">
              Sign Up
            </button>
          </form>
          <div className="loginLinkWrapper">
            Already Have an Account? <Link to="/login">Sign-In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
