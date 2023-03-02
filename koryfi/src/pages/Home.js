import React, { useContext } from "react";
import { useProduct } from "../contexts/ProductContext.js";

export default function Home() {
  const products = useProduct();

  return (
    <div style={{ marginTop: "60px" }}>
      {products.products !== undefined && products.products[4].name}
    </div>
  );
}
