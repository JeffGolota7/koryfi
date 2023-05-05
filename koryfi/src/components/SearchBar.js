import React, { useState, useEffect } from "react";
import "../styles/SearchBar.css";
import { Link, useLocation } from "react-router-dom";
import { getProductsFromDatabaseByText } from "../contexts/ProductContext";
import { ReactComponent as SnowboardIcon } from "../icons/snowboard.svg";
import { ReactComponent as SkiIcon } from "../icons/ski.svg";

export default function SearchBar({ toggleHamburger, isHamOpen }) {
  const [query, setQuery] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { pathname } = useLocation();

  function handleChange(queryText) {
    setSearchValue(queryText);
    getProductsFromDatabaseByText(queryText).then((response) => {
      response.shift();
      setQuery(response);
    });
  }

  useEffect(() => {
    setSearchValue("");

    setQuery("");
  }, [isHamOpen, pathname]);

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search for products"
        onBlur={(e) => {
          if (e.relatedTarget !== null) {
            if (e.relatedTarget.id === "result") {
              e.target.value = "";
            }
          }
        }}
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
      />

      {query.length > 0 && (
        <div className="results" id="resultsId">
          {query.map((prod) => (
            <Link
              to="/product-information"
              state={{ productObject: prod }}
              onClick={() => {
                if (isHamOpen) {
                  toggleHamburger(false);
                }
                setQuery([]);
                setSearchValue("");
              }}
              id="result"
              className="result"
            >
              {prod.category.includes("snowboard") && (
                <SnowboardIcon id="icon" />
              )}
              {prod.category.includes("skis") && <SkiIcon id="icon" />}
              <h5>{prod.name}</h5>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
