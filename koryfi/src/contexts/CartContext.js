import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext([]);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [initialCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [cart, updateCart] = useState(initialCart);

  function setCart(product) {
    console.log(product);
    const existingProduct = cart.find((item) => item.name === product.name);
    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.name === product.name ? { ...item, count: item.count + 1 } : item
      );
      updateCart(updatedCart);
    } else {
      const updatedCart = [...cart, { ...product, count: 1 }];
      updateCart(updatedCart);
    }
  }

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
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    updateCart(updatedCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const updateCount = (index, value) => {
    const updatedCart = [...cart];
    if (updatedCart[index].count + value > 0) {
      updatedCart[index].count += value;
      updateCart(updatedCart);
    } else {
      removeItem(index);
    }
  };

  const value = {
    cart,
    setCart,
    removeItem,
    updateCount,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
