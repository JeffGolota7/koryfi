import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as Icon } from "../icons/Account-Icon.svg";
import Dropdown from "./Dropdown.js";
import "../styles/AccountIcon.css";

export default function AccountIcon() {
  const [isOpen, toggleIsOpen] = useState(false);

  const accountDropdownRef = useRef(null);

  function useOutsideClick(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          toggleIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideClick(accountDropdownRef);

  return (
    <div className="accountIconWrapper" ref={accountDropdownRef}>
      <Icon
        onClick={() => {
          toggleIsOpen(!isOpen);
        }}
      />
      {isOpen && <Dropdown toggleIsOpen={toggleIsOpen} type="account" />}
    </div>
  );
}
