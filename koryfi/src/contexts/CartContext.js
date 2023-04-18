import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext([]);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [initialCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart && !cart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cart !== initialCart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, initialCart]);

  const removeItem = (index) => {
    console.log(cart);
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const value = {
    cart,
    setCart,
    removeItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
