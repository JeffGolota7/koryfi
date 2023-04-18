import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card.js";
import {
  getProductsFromDatabaseByText,
  getAllProductsFromDatabase,
  useProduct,
} from "../contexts/ProductContext";
import "../styles/Products.css";

export default function Products() {
  const [displayedProducts, updateDisplayedProducts] = useState([]);
  const { products } = useProduct();

  async function handleSearch(queryText) {
    if (queryText !== "") {
      getProductsFromDatabaseByText(queryText).then((response) => {
        response.shift();
        updateDisplayedProducts(response);
      });
    } else {
      if (products) {
        updateDisplayedProducts(products);
      } else {
        updateDisplayedProducts(getAllProductsFromDatabase());
      }
    }
  }

  useEffect(() => {
    if (products) {
      updateDisplayedProducts(products);
    } else {
      updateDisplayedProducts(getAllProductsFromDatabase());
    }
  }, [products]);

  return (
    <div className="product-page">
      <div className="left-column">
        <div className="filters">
          <ul className="filter-list">
            <label htmlFor="category-list">Category</label>
            <div className="category-list filter-section">
              <div className="filter">
                <input
                  type="checkbox"
                  id="snowboard"
                  name="snowboard"
                  value="Snowboard"
                />
                <label for="snowboard">Snowboard</label>
              </div>
              <div className="filter">
                <input type="checkbox" id="skis" name="skis" value="Skis" />
                <label for="Skis">Skis</label>
              </div>
              <div className="filter">
                <input
                  type="checkbox"
                  id="Clothes"
                  name="clothes"
                  value="Clothes"
                />
                <label for="clothes">Clothes</label>
              </div>
            </div>
          </ul>
        </div>
      </div>
      <div className="right-column">
        <div className="search">
          <input type="text" onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <div className="product-gallery">
          {displayedProducts !== null &&
            displayedProducts.map((product) => {
              return <Card product={product} />;
            })}
        </div>
      </div>
    </div>
  );
}
