import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/Card.css";

export default function Card(product) {
  const prod = product.product;
  return (
    <Link to="/product-information" state={{ productObject: prod }}>
      <div className="card">
        <div className="image">
          {prod.images.length > 0 ? (
            <img
              src={`${
                prod.category.includes("clothing")
                  ? prod.images[0].images[0].lowRes
                  : prod.images[0].lowRes
              }`}
              alt=""
            />
          ) : (
            <div className="noPhoto"></div>
          )}
        </div>
        <div className="cardContent">
          <h4 className="prodTitle">{prod.name}</h4>
          <h5>{prod.price}</h5>
        </div>
      </div>
    </Link>
  );
}
