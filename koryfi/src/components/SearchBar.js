import React, { useState } from "react";
import "../styles/SearchBar.css";
import { Link } from "react-router-dom";
import { getProductsFromDatabaseByText } from "../contexts/ProductContext";

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
              state={{ product: prod }}
              onClick={() => setQuery([])}
              id="result"
            >
              {prod.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
