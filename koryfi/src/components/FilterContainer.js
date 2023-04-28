import React from "react";
import RangeFilter from "./RangeFilter";
import "../styles/FilterContainer.css";

export default function FilterContainer(props) {
  function handleOnChange(event) {
    const { name } = event.target;
    props.updateSelectedFilters({ name: name, filterType: "check" });
  }

  return (
    <div className="filters">
      <ul className="filter-list">
        <div className="category-list filter-section">
          <label htmlFor="category-list" className="category category-header">
            Category
          </label>
          <div className="filter">
            <input
              type="checkbox"
              id="snowboard"
              className="checkbox"
              name="snowboard"
              value="Snowboard"
              onChange={(event) => handleOnChange(event)}
            />
            <label className="label" for="snowboard">
              Snowboard
            </label>
          </div>
          <div className="filter">
            <input
              type="checkbox"
              id="skis"
              name="skis"
              value="Skis"
              className="checkbox"
            />
            <label className="label" for="Skis">
              Skis
            </label>
          </div>
          v
          <div className="filter priceContainer">
            <label className="category" for="price">
              Price
            </label>
            <RangeFilter
              selectedFilters={props.selectedFilters}
              updateSelectedFilters={props.updateSelectedFilters}
              id="price"
              name="price"
              value="price"
              type="price"
              category="all"
              min={0}
              max={1000}
            />
          </div>
        </div>
        <div className="conditionalFilters">
          {props.selectedFilters.some(
            (filter) => filter.name === "snowboard"
          ) && (
            <>
              <label className="category" for="length">
                Length
              </label>
              <RangeFilter
                selectedFilters={props.selectedFilters}
                updateSelectedFilters={props.updateSelectedFilters}
                id="Length"
                name="length"
                value="Length"
                type="length"
                category="snowboard"
                min={70}
                max={170}
              />
              <label className="category" for="width">
                Width
              </label>
              <RangeFilter
                selectedFilters={props.selectedFilters}
                updateSelectedFilters={props.updateSelectedFilters}
                id="Width"
                name="width"
                value="Width"
                type="width"
                category="snowboard"
                min={70}
                max={170}
              />
              <div className="filter">
                <input
                  type="checkbox"
                  id="Clothes"
                  className="checkbox"
                  name="clothes"
                  value="Clothes"
                />
                <label className="label" for="clothes">
                  Clothes
                </label>
              </div>
            </>
          )}
        </div>
      </ul>
    </div>
  );
}
