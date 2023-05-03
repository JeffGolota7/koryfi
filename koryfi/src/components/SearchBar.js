import React, { useState } from "react";
import "../styles/SearchBar.css";
import { Link } from "react-router-dom";
import { getProductsFromDatabaseByText } from "../contexts/ProductContext";
import { ReactComponent as SnowboardIcon } from "../icons/snowboard.svg";
import { ReactComponent as SkiIcon } from "../icons/ski.svg";

export default function SearchBar() {
  const [query, setQuery] = useState([]);

  function handleChange(queryText) {
    getProductsFromDatabaseByText(queryText).then((response) => {
      response.shift();
      setQuery(response);
    });
  }
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
        onChange={(e) => handleChange(e.target.value)}
      />

      {query.length > 0 && (
        <div className="results" id="resultsId">
          {query.map((prod) => (
            <Link
              to="/product-information"
              state={{ productObject: prod }}
              onClick={() => setQuery([])}
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
