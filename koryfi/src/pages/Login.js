import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";

import "../styles/Login.css";

function Login() {
  const [isLoading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();

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
  return (
    <div className="loginWrapper">
      <div className="loginCard">
        <div className="leftSide">
          <h2>Welcome Back</h2>
        </div>
        <div className="rightSide">
          <form className="loginForm" onSubmit={register}>
            <div id="email">
              <label>Email</label>
              <input ref={emailRef} type="text" required />
            </div>
            <div id="password">
              <label>Password</label>
              <input ref={passwordRef} type="password" required />
            </div>
            <button disabled={isLoading} type="submit">
              Log In
            </button>
          </form>
          <div className="signupLinkWrapper">
            Not Signed Up? <Link to="/sign-up">Sign-Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
