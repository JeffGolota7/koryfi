import React, { useState } from "react";
import RangeFilter from "./RangeFilter";
import "../styles/FilterContainer.css";
import { IsMobile } from "../helpers/isMobile.js";
import { ReactComponent as FilterIcon } from "../icons/filteradd.svg";

export default function FilterContainer(props) {
  const mobile = IsMobile();
  const [mobileMenu, updateMobileMenu] = useState(false);
  function handleOnChange(event) {
    const { name, value } = event.target;
    props.updateSelectedFilters({
      name: name,
      filterType: "check",
      value: value,
    });
  }

  function handleMobileMenu() {
    if (mobileMenu) {
      updateMobileMenu(false);
    } else {
      updateMobileMenu(true);
    }
  }

  return (
    <div className="filters">
      {!mobile ? (
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
                value="category"
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
                value="category"
                className="checkbox"
                onChange={(event) => handleOnChange(event)}
              />
              <label className="label" for="Skis">
                Skis
              </label>
            </div>
            <div className="filter">
              <input
                type="checkbox"
                id="Clothes"
                className="checkbox"
                name="clothing"
                value="category"
                onChange={(event) => handleOnChange(event)}
              />
              <label className="label" for="clothes">
                Clothes
              </label>
            </div>
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
                category="price"
                min={0}
                max={1000}
              />
            </div>
          </div>
          <div className="conditionalFilters">
            {props.selectedFilters.some(
              (filter) =>
                filter.name === "snowboard" &&
                props.selectedFilters.filter(
                  (filter) => filter.filterType === "check"
                ).length === 1
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
                  min={100}
                  max={200}
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
                  min={225}
                  max={300}
                />
              </>
            )}
          </div>
        </ul>
      ) : (
        <div className="filterListMobile">
          {!mobileMenu ? (
            <div className="mobileFilterBanner">
              <FilterIcon className="filterIcon" onClick={handleMobileMenu} />
              <div className="mobileFilters">
                {props.selectedFilters.map((filter) => (
                  <div
                    className="selectedFilterPill"
                    onClick={() =>
                      props.updateSelectedFilters({
                        name: filter.name,
                        filterType: filter.type,
                      })
                    }
                  >
                    <p>X</p>
                    <p>
                      {`${filter.name
                        .charAt(0)
                        .toUpperCase()}${filter.name.slice(1)}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mobileMenu">
                <button className="apply" onClick={handleMobileMenu}>
                  Apply Filters
                </button>
                <div className="category-list filter-section">
                  <label
                    htmlFor="category-list"
                    className="category category-header"
                  >
                    Category
                  </label>
                  <div className="filter">
                    <input
                      type="checkbox"
                      checked={props.selectedFilters.find((filter) =>
                        filter.name === "snowboard" ? true : false
                      )}
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
                      checked={props.selectedFilters.find((filter) =>
                        filter.name === "skis" ? true : false
                      )}
                      id="skis"
                      name="skis"
                      value="Skis"
                      className="checkbox"
                      onChange={(event) => handleOnChange(event)}
                    />
                    <label className="label" for="Skis">
                      Skis
                    </label>
                  </div>
                  <div className="filter">
                    <input
                      type="checkbox"
                      checked={props.selectedFilters.find((filter) =>
                        filter.name === "clothing" ? true : false
                      )}
                      id="Clothes"
                      className="checkbox"
                      name="clothing"
                      value="Clothes"
                      onChange={(event) => handleOnChange(event)}
                    />
                    <label className="label" for="clothes">
                      Clothes
                    </label>
                  </div>
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
                      category="Price"
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
                        min={100}
                        max={200}
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
                        min={225}
                        max={300}
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
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
