import React, { useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, getDocs, collection, query, setDoc } from "firebase/firestore";
import data from "./products.json";
export const ProductContext = React.createContext();

export function useProduct() {
  return useContext(ProductContext);
}

export function ProductProvider({ children }) {
  const [products, updateProducts] = useState();
  const [isLoading, setLoading] = useState(true);
  data.forEach(async (product) => {
    if (product.category === "snowboard") {
      await setDoc(doc(db, "products", product.name), {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        type: product.type,
        category: product.category,
        difficulty: product.difficulty,
        width: product.width,
        length: product.length,
        flex: product.flex,
      });
    }
    if (product.category === "jacket") {
      await setDoc(doc(db, "products", product.name), {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
      });
    }
  });

  async function getProductsFromDatabase() {
    try {
      const docSnap = await getDocs(collection(db, "products"));
      if (docSnap) {
        const products = [{}];

        docSnap.docs.forEach((prod) => {
          products.push(prod.data());
        });

        return await products;
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getProductsFromDatabase().then((data) => {
      updateProducts(data);
    });
    setLoading(false);
  }, []);

  const value = {
    products,
  };

  return (
    <ProductContext.Provider value={value}>
      {!isLoading && children}
    </ProductContext.Provider>
  );
}
