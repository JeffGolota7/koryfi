import React, { useContext } from "react";
import { useProduct } from "../contexts/ProductContext.js";

export default function Home() {
  const products = useProduct();

  return <div></div>;
}
