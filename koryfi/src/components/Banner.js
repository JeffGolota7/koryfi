import React, { useEffect } from "react";
import "../styles/Banner.css";

function Banner({ message, duration, isVisible, setVisible }) {
  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(() => {
        setVisible(false);
      }, duration + 300);
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
