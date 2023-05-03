import React, { useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  doc,
  getDocs,
  getDoc,
  updateDoc,
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
  // data.forEach(async (product) => {
  //   if (product.category === "snowboard") {
  //     await setDoc(doc(db, "products", product.name), {
  //       id: product.id,
  //       name: product.name,
  //       description: product.description,
  //       price: product.price,
  //       rating: product.rating,
  //       images: product.images,
  //       type: product.type,
  //       camber: product.camber,
  //       category: product.category,
  //       difficulty: product.difficulty,
  //       width: product.width,
  //       length: product.length,
  //       flex: product.flex,
  //     });
  //   }
  //   if (product.category.includes("clothing")) {
  //     await setDoc(doc(db, "products", product.name), {
  //       id: product.id,
  //       name: product.name,
  //       price: product.price,
  //       category: product.category,
  //       description: product.description,
  //       images: product.images,
  //     });
  //   }
  // });

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

  async function addReview(currentUser, product, review) {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const productRef = doc(db, "products", product.name);
      try {
        const userSnap = await getDoc(userRef);
        const productSnap = await getDoc(productRef);
        const user = userSnap.data();
        const productObject = productSnap.data();
        if (
          user.purchaseHistory &&
          user.purchaseHistory.some((purchase) => purchase.id === product.id)
        ) {
          const purchase = user.purchaseHistory.find(
            (purchase) => purchase.id === product.id
          );
          if (!purchase.review) {
            purchase.review = review;
          }

          const tempPurchaseHistory = user.purchaseHistory.map((purch) => {
            if (purch.id === purchase.id) {
              return purchase;
            }
            return purch;
          });

          await updateDoc(userRef, {
            purchaseHistory: tempPurchaseHistory,
          });

          if (productObject.reviews && productObject.reviews.length > 0) {
            const reviewsTemp = productObject.reviews;
            reviewsTemp.push(review);
            const sum = reviewsTemp.reduce(
              (acc, review) => acc + review.rating,
              0
            );
            const average = (sum / reviewsTemp.length).toFixed(1);
            await updateDoc(productRef, {
              avgRating: average,
              reviews: reviewsTemp,
            });
            user.purchaseHistory = tempPurchaseHistory;
            const currentContextProd = products.find(
              (prod) => prod.id === product.id
            );
            currentContextProd.avgRating = average;
            let currentContextProdReviews = currentContextProd.reviews;
            currentContextProdReviews.push(review);
            currentContextProd.reviews = currentContextProdReviews;

            const updatedProducts = products.map((prod) => {
              if (prod.id === currentContextProd.id) {
                return currentContextProd;
              }
              return prod;
            });

            updateProducts(updatedProducts);
          } else {
            await updateDoc(productRef, {
              avgRating: review.rating,
              reviews: [review],
            });
            user.purchaseHistory = tempPurchaseHistory;
            const currentContextProd = products.find(
              (prod) => prod.id === product.id
            );
            currentContextProd.avgRating = review.rating;
            currentContextProd.reviews = [review];
            const updatedProducts = products.map((prod) => {
              if (prod.id === currentContextProd.id) {
                return currentContextProd;
              }
              return prod;
            });

            updateProducts(updatedProducts);
          }

          alert("Review Added");
        }
      } catch (e) {
        alert(e);
      }
    }
  }

  const value = {
    products,
    addReview,
  };

  return (
    <ProductContext.Provider value={value}>
      {!isLoading && children}
    </ProductContext.Provider>
  );
}
