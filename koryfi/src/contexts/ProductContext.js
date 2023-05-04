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
  data.forEach(async (product) => {
    if (product.category === "snowboard") {
      await setDoc(doc(db, "products", product.name), {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        category: product.category,
        sizes: product.sizes,
        bend: product.bend,
        length: product.length,
        sex: product.sex,
        width: product.width,
        difficulty: product.difficulty,
        terrain: product.terrain,
        flex: product.flex,
        shape: product.shape,
      });
    }
    if (product.category.includes("skis")) {
      await setDoc(doc(db, "products", product.name), {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        category: product.category,
        sex: product.sex,
        length: product.length,
        width: product.width,
        rockerType: product.rockerType,
        flex: product.flex,
        turnRadius: product.turnRadius,
        terrain: product.terrain,
      });
    }
    if (product.category.includes("clothing")) {
      if (product.category.includes("gloves")) {
        await setDoc(doc(db, "products", product.name), {
          name: product.name,
          id: product.id,
          category: product.category,
          color: product.color,
          size: product.size,
          gender: product.gender,
          features: product.features,
          description: product.description,
          price: product.price,
          images: product.images,
        });
      }
      if (product.category.includes("jacket")) {
        await setDoc(doc(db, "products", product.name), {
          id: product.id,
          price: product.price,
          gender: product.gender,
          name: product.name,
          description: product.description,
          color: product.color,
          images: product.images,
          category: product.category,
          sizes: product.sizes,
          waterproof_rating: product.waterproof_rating,
          breathability_rating: product.breathability_rating,
          insulation: product.insulation,
          seams: product.seams,
          hood: product.hood,
          pockets: product.pockets,
          powder_skirt: product.powder_skirt,
          cuffs: product.cuffs,
          venting: product.venting,
          hem: product.hem,
          jacket_to_pant_interface: product.jacket_to_pant_interface,
        });
      }
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

  async function addReview(currentUser, product, review) {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const productRef = doc(db, "products", product.name);
      try {
        // Grabbing the referred to user and product for review
        const userSnap = await getDoc(userRef);
        const productSnap = await getDoc(productRef);
        const user = userSnap.data();
        const productObject = productSnap.data();

        const purchaseHistory = user.purchaseHistory;

        // If the user has an existing purchase history
        if (purchaseHistory) {
          // Keep track of index of the purchase including the item
          let indexOfPurchase;
          const itemExists = purchaseHistory.find((purchase, index) => {
            return purchase.itemsPurchased.some((item) => {
              if (item.id === product.id) {
                indexOfPurchase = index;
              }
              return item.id === product.id;
            });
          });

          if (itemExists) {
            purchaseHistory[indexOfPurchase].review = review;

            await updateDoc(userRef, {
              purchaseHistory: purchaseHistory,
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
              user.purchaseHistory = purchaseHistory;
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
