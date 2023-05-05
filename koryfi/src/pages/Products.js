import React, { useState, useEffect } from "react";
import Card from "../components/Card.js";
import {
  getProductsFromDatabaseByText,
  getAllProductsFromDatabase,
  useProduct,
} from "../contexts/ProductContext";
import FilterContainer from "../components/FilterContainer.js";
import "../styles/Products.css";

export default function Products() {
  const [displayedProducts, updateDisplayedProducts] = useState([]);
  const [allProducts, updateProducts] = useState([]);
  const [selectedFilters, updateSelectedFilters] = useState([
    {
      name: "price",
      minprice: 0,
      maxprice: 1000,
      type: "price",
      filterType: "range",
    },
  ]);
  const { products } = useProduct();
  const [numToShow, updateNumToShow] = useState(10);

  async function handleSearch(queryText) {
    if (queryText !== "") {
      getProductsFromDatabaseByText(queryText).then((response) => {
        response.shift();
        updateDisplayedProducts(response);
        updateNumToShow(10);
      });
    } else {
      if (products) {
        updateDisplayedProducts(products);
        updateNumToShow(10);
      } else {
        updateDisplayedProducts(getAllProductsFromDatabase());
        updateNumToShow(10);
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
      const rangeFilters = selectedFilters.filter(
        (filter) => filter.filterType === "range"
      );
      const checkFilters = selectedFilters.filter(
        (filter) => filter.filterType === "check"
      );

      const rangeFilterResult =
        rangeFilters.length === 0 ||
        rangeFilters.every((filter) => {
          return (
            product[filter.type] >= filter[`min${filter.type}`] &&
            product[filter.type] <= filter[`max${filter.type}`]
          );
        });
      const checkFilterResult =
        checkFilters.length === 0 ||
        checkFilters.some((filter) => product.category.includes(filter.name));
      return rangeFilterResult && checkFilterResult;
    });
    updateDisplayedProducts(filteredProducts.slice(0, numToShow));
  }, [selectedFilters, numToShow]);

  useEffect(() => {
    if (products) {
      updateDisplayedProducts(products);
      updateProducts(products);
    } else {
      updateDisplayedProducts(getAllProductsFromDatabase());
      updateProducts(displayedProducts);
    }
    updateNumToShow(10);
  }, [products]);

  function handleLoadMore() {
    updateNumToShow(numToShow + 10);
  }

  return (
    <div className="catalog">
      <div className="catalogHeader">
        <h1>Product Catalog</h1>
        <hr />
      </div>
      <div className="product-page">
        <div className="left-column">
          <FilterContainer
            updateSelectedFilters={handleFilterChange}
            selectedFilters={selectedFilters}
          />
        </div>
        <div className="right-column">
          <div className="search">
            <input
              type="text"
              placeholder="Search for products"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="product-gallery">
            {displayedProducts.length > 0 &&
              displayedProducts.slice(0, numToShow).map((p) => {
                return <Card product={p} />;
              })}
          </div>

          <button onClick={handleLoadMore}>Load More</button>
        </div>
      </div>
    </div>
  );
}
