import React, { useState, useEffect } from "react";
import "../styles/Banner.css";

function Banner({ message, type, duration, isVisible, setVisible }) {
  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(() => {
        setVisible(false);
      }, duration + 300); // add 300ms delay to allow for animation
    }

    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <>
      <div
        className={`banner ${isVisible ? "visible" : ""}`}
        onAnimationEnd={() => {
          if (!isVisible) {
            setVisible(false);
          }
        }}
      >
        <p>{message}</p>
      </div>
    </>
  );
}

export default Banner;
