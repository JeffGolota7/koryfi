import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import PostCheckout from "./pages/PostCheckout";
import Login from "./pages/Login";
import Checkout from "./pages/PreCheckoutPage";
import CheckoutPage from "./pages/CheckoutPage";
import Account from "./pages/Account";
import Products from "./pages/Products";
import ProductDetailPage from "./pages/ProductDetailPage";
import { BannerProvider } from "./contexts/BannerProvider";
import ScrollToTop from "./helpers/ScrollToTop";

const ProductContext = createContext({});

function App() {
  const location = useLocation();
  const [products, updateProducts] = useState();

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://smtpjs.com/v3/smtp.js";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  });

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ProductContext.Provider value={products}>
      <BannerProvider>
        <Navbar />
        <div
          style={location.pathname !== "/" ? { marginTop: "80px" } : {}}
        ></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/confirm" element={<CheckoutPage />} />
          <Route path="/post-checkout" element={<PostCheckout />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/account" element={<Account />} />
          <Route path="/product-information" element={<ProductDetailPage />} />
        </Routes>
        <ScrollToTop />
        <Footer />
      </BannerProvider>
    </ProductContext.Provider>
  );
}

export default App;
