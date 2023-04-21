import React, { useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  doc,
  getDocs,
  collection,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import data from "./products.json";
export const ProductContext = React.createContext();

export function useProduct() {
  return useContext(ProductContext);
}

let productCache;

export async function getProductsFromDatabaseByText(queryText) {
  if (queryText) {
    let docSnap;
    if (!productCache) {
      docSnap = await getDocs(collection(db, "products"));
      productCache = docSnap;
    } else {
      docSnap = productCache;
    }
    if (docSnap) {
      const products = [{}];
      docSnap.docs.forEach((prod) => {
        let currentProd = prod.data();
        if (
          currentProd.name.includes(queryText) ||
          currentProd.name.includes(queryText.toLowerCase()) ||
          currentProd.name.toLowerCase().includes(queryText) ||
          currentProd.name.toLowerCase().includes(queryText.toLowerCase()) ||
          currentProd.category.includes(queryText) ||
          currentProd.category.includes(queryText.toLowerCase())
        ) {
          products.push(prod.data());
        }
      });

      return await products;
    }
  } else {
    return [];
  }
}

export async function getAllProductsFromDatabase() {
  try {
    const docSnap = await getDocs(collection(db, "products"));
    if (docSnap) {
      const products = [{}];

      docSnap.docs.forEach((prod) => {
        products.push(prod.data());
      });
      products.shift();
      return await products;
    }
  } catch (e) {
    console.log(e);
  }
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
        rating: product.rating,
        images: product.images,
        type: product.type,
        camber: product.camber,
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
        images: product.images,
      });
    }
  });

  async function getAllProductsFromDatabase() {
    if (!products) {
      try {
        const docSnap = await getDocs(collection(db, "products"));
        if (docSnap) {
          const prods = [{}];

          docSnap.docs.forEach((prod) => {
            prods.push(prod.data());
          });
          prods.shift();
          updateProducts(prods);
          return await prods;
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      return products;
    }
  }

  useEffect(() => {
    getAllProductsFromDatabase().then((data) => {
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
