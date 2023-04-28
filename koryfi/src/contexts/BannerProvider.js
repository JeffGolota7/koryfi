import React, { useState, useEffect, useContext } from "react";
import "../styles/Banner.css";

const BannerContext = React.createContext();

export function useBanner() {
  const [isVisible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState(3000);

  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(() => {
        setVisible(false);
      }, duration + 300);
    }

    return () => clearTimeout(timer);
  }, [isVisible, duration]);

  return {
    isVisible,
    message,
    type,
    setVisible,
    setMessage,
    setType,
    setDuration,
  };
}

export function BannerProvider({ children }) {
  const {
    isVisible,
    message,
    type,
    setVisible,
    setMessage,
    setType,
    setDuration,
  } = useBanner();

  return (
    <BannerContext.Provider
      value={{
        isVisible,
        message,
        type,
        setVisible,
        setMessage,
        setType,
        setDuration,
      }}
    >
      {children}
      <div className={`banner ${isVisible ? "visible" : ""}`}>
        <p>{message}</p>
      </div>
    </BannerContext.Provider>
  );
}

export function useBannerContext() {
  return useContext(BannerContext);
}
