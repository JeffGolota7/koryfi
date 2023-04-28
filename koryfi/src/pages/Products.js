import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card.js";
import {
  getProductsFromDatabaseByText,
  getAllProductsFromDatabase,
  useProduct,
} from "../contexts/ProductContext";
import "../styles/Products.css";
import FilterContainer from "../components/FilterContainer.js";

export default function Products() {
  const [displayedProducts, updateDisplayedProducts] = useState([]);
  const [allProducts, updateProducts] = useState([]);
  const [selectedFilters, updateSelectedFilters] = useState([
    {
      name: "all",
      minprice: 0,
      maxprice: 1000,
      type: "price",
      filterType: "range",
    },
  ]);
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

  function handleFilterChange(filter) {
    const index = selectedFilters.findIndex((f) => f.name === filter.name);

    const newFilters = [...selectedFilters];
    if (index === -1) {
      newFilters.push(filter);
    } else {
      if (filter.filterType === "range") {
        newFilters.splice(index, 1, filter);
      } else {
        newFilters.splice(index, 1);
      }
    }
    updateSelectedFilters(newFilters);
  }

  useEffect(() => {
    const filteredProducts = [...allProducts].filter((product) => {
      return selectedFilters.every((filter) => {
        switch (filter.filterType) {
          case "range":
            return (
              product[filter.type] >= filter[`min${filter.type}`] &&
              product[filter.type] <= filter[`max${filter.type}`]
            );
          case "check":
            return product.category.includes(filter.name);
          default:
            return true;
        }
      });
    });
    updateDisplayedProducts(filteredProducts);
  }, [selectedFilters]);

  useEffect(() => {
    if (products) {
      updateDisplayedProducts(products);
      updateProducts(products);
    } else {
      updateDisplayedProducts(getAllProductsFromDatabase());
      updateProducts(displayedProducts);
    }
  }, [products]);

  return (
    <div className="product-page">
      <div className="left-column">
        <FilterContainer
          updateSelectedFilters={handleFilterChange}
          selectedFilters={selectedFilters}
        />
      </div>
      <div className="right-column">
        <div className="search">
          <input type="text" onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <div className="product-gallery">
          {displayedProducts.length > 0 &&
            displayedProducts.map((p) => {
              return <Card product={p} />;
            })}
        </div>
      </div>
    </div>
  );
}
