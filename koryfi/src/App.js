import React, {
  createContext,
  useMemo,
  useEffect,
  useState,
  useContext,
} from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { db } from "./firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Account from "./pages/Account";
import useProductContext from "./contexts/ProductContext";

const ProductContext = createContext({});

function App() {
  const [products, updateProducts] = useState();

  const fetchProducts = useMemo(() => {});

  useEffect(() => {}, [fetchProducts]);

  return (
    <ProductContext.Provider value={products}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </ProductContext.Provider>
  );
}

export default App;
