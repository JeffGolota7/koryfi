import React, { useState, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth, AuthProvider } from "../contexts/AuthContext";

import "../styles/SignUp.css";

function SignUp() {
  const [isLoading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const { signup, currentUser } = useAuth();

  const register = (e) => {
    e.preventDefault();
    if (
      emailRef.current.value !== "" &&
      passwordRef.current.value !== "" &&
      passwordRef.current.value === confirmPasswordRef.current.value
    ) {
      setLoading(true);
      signup(emailRef.current.value, passwordRef.current.value)
        .then((auth) => {
          alert("Success!");
        })
        .catch((e) => {
          alert(e.message);
        });
      setLoading(false);
    } else {
      alert("User Name and/or Password Cannot be Blank!");
    }
  };
  return (
    <div className="signupWrapper">
      <div className="leftSide">
        <h2>Join Us</h2>
      </div>
      <div className="rightSide">
        {currentUser.email}
        <form className="signupForm" onSubmit={register}>
          <div id="email">
            <label>Email</label>
            <input ref={emailRef} type="text" required />
          </div>
          <div id="password">
            <label>Password</label>
            <input ref={passwordRef} type="password" required />
          </div>
          <div id="password">
            <label>Confirm Password</label>
            <input ref={confirmPasswordRef} type="password" required />
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
  );
}

export default SignUp;
