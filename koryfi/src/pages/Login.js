import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";
import { IsMobile } from "../helpers/isMobile.js";

import "../styles/Login.css";
import "../styles/Form.css";

function Login() {
  const [isLoading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const mobile = IsMobile();

  const register = (e) => {
    e.preventDefault();
    if (emailRef.current.value !== "" && passwordRef.current.value !== "") {
      setLoading(true);
      login(emailRef.current.value, passwordRef.current.value)
        .then((auth) => {
          alert("Success!");
          navigate("/");
        })
        .catch((e) => {
          // Have an error state variable that changes based on the feedback
          alert(e.message);
        });
      setLoading(false);
    } else {
      alert("User Name and/or Password Cannot be Blank!");
    }
  };

  function handleForgotPassword(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      forgotPassword(email);
    } else {
      alert("Enter a valid email");
    }
  }

  return (
    <div className="formWrapper">
      <div className="formCard">
        <div className="leftSide">
          <h2>Welcome Back!</h2>
          {!mobile && <img src="./images/login.png" alt="" />}
        </div>
        <div className="rightSide">
          <form className="loginForm" onSubmit={register}>
            <div id="email" className="input">
              <label>Email</label>
              <input ref={emailRef} type="text" required />
            </div>
            <div id="password" className="input">
              <label>Password</label>
              <input ref={passwordRef} type="password" required />
              <span
                onClick={() => handleForgotPassword(emailRef.current.value)}
                className="forgotPassword"
              >
                Forgot Password?
              </span>
            </div>
            <button disabled={isLoading} type="submit">
              Log In
            </button>
          </form>
          <div className="signupLinkWrapper">
            Need an Account? <Link to="/sign-up">Sign-Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
