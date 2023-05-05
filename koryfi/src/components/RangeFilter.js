import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/RangeFilter.css";

function RangeFilter({
  min,
  max,
  name,
  updateSelectedFilters,
  category,
  type,
}) {
  const [range, setRange] = useState([min, max]);

  const handleRangeChange = (value) => {
    setRange(value);
    updateSelectedFilters({
      name: name,
      category: category,
      [`min${type}`]: range[0],
      [`max${type}`]: range[1],
      type: type,
      filterType: "range",
    });
  };

  return (
    <div className="range-filter">
      <Slider
        range
        min={min}
        max={max}
        defaultValue={[min, max]}
        value={range}
        onChange={handleRangeChange}
        className="t-slider"
      />
      <p className="current-values">
        {name === "price"
          ? `${range[0]}$ - ${range[1]}$`
          : `${range[0]}${name === "length" ? "cm" : "mm"} - ${range[1]}${
              name === "length" ? "cm" : "mm"
            }`}
      </p>
    </div>
  );
}

export default RangeFilter;
