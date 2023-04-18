import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/Card.css";

export default function Card(product) {
  const prod = product.product;
  return (
    <Link to="/product-information" state={{ product: prod }}>
      <div className="card">
        <div className="image">
          {prod.images !== [] ? (
            <img src={prod.images[0]} alt="" />
          ) : (
            <div className="noPhoto"></div>
          )}
        </div>
        <div className="cardContent">
          <h4 className="prodTitle">{prod.name}</h4>
        </div>
      </div>
    </Link>
  );
}
