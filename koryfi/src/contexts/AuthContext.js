import React, { useContext, useState, useEffect } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  db,
} from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setLoading] = useState(true);

  function signup(email, password) {
    // sendSignUpEmail(email);
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function forgotPassword(email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("email sent");
      })
      .catch((e) => {
        alert(e);
      });
  }

  function sendSignUpEmail(email) {
    const emailConfig = {
      Username: "koryfisportsinfo@gmail.com",
      Password: "4BA4A52CCEBC3C50F48570A37B17A5B2C80B",
      Host: "smtp.elasticemail.com",
      Port: 2525,
      To: email,
      From: "koryfisportsinfo@gmail.com",
      Subject: "Welcome to the Family!",
      Body: `<!DOCTYPE html>
<html>
<head>
	<title>Welcome to the Family!</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<style type="text/css">
		body {
			margin: 0;
			padding: 0;
			background-color: #f8f8f8;
			font-family: Raleway, sans-serif;
			color: #333333;
			line-height: 1.5;
		}

		.container {
			max-width: 600px;
			margin: 0 auto;
			background-color: #ffffff;
			padding: 30px;
			box-sizing: border-box;
			border-radius: 5px;
			box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
		}

		h1 {
			margin-top: 0;
			font-size: 24px;
			text-align: center;
			color: #ffcc00;
		}

		.btn {
			display: inline-block;
			background-color: #ffcc00;
			color: #ffffff;
			padding: 10px 20px;
			border-radius: 5px;
			text-decoration: none;
			margin-top: 20px;
			text-align: center;
			box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
		}

		.btn:hover {
			background-color: #e6b800;
		}

		.separator {
			background-color: #dddddd;
			height: 1px;
			margin-top: 30px;
			margin-bottom: 30px;
		}

		.message {
      background-image: url('https://images.unsplash.com/photo-1616429553002-faf23468952d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80');
			background-repeat: no-repeat;
			background-position: center center;
			background-size: cover;
			height: 400px;
			border-radius: 5px;
			margin-top: 30px;
			box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
		}

		.message h2 {
			color: #ffffff;
			font-size: 24px;
			margin: 0;
			padding: 20px;
			background-color: rgba(0, 0, 0, 0.5);
			border-radius: 5px 5px 0 0;
		}

		.message p {
			color: #ffffff;
			font-size: 16px;
			margin: 0;
			padding: 20px;
			background-color: rgba(0, 0, 0, 0.5);
			border-radius: 0 0 5px 5px;
		}
	</style>
</head>
<body>
	<div class="container">
		<img src="http://www.koryfisports.netlify.app/images/Koryfi-Logo.png" alt="Welcome to the Family!" style="display: block; max-width: 100%; height: auto;">
		<h1>Welcome to the Family!</h1>
		<div class="separator"></div>
		<div class="message">
			<h2>Now that you're one of us...</h2>
			<p>Check out what we have!</p>
			<a href="http://www.koryfisports.com" class="btn">Shop Now</a>
		</div>
	</div>
</body>
</html>`,
    };

    if (window.Email) {
      window.Email.send(emailConfig).then((message) => alert(message));
    }
  }

  async function getUserFromDatabase(user) {
    const docRef = doc(db, "users", user.uid);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap) {
        return await docSnap.data();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function editDataField(user, fieldName, newValue) {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          [fieldName]: newValue,
        });
        alert("Value Updated");
        user[fieldName] = newValue;
      } catch (e) {
        alert(e);
      }
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserFromDatabase(user).then((data) => {
          user.firstName = data.firstName;
          user.lastName = data.lastName;
          user.cart = [{}];
        });
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {}, [currentUser]);

  const value = {
    currentUser,
    editDataField,
    sendSignUpEmail,
    forgotPassword,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
