"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";
import { products as fallbackProducts } from "@/data/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("order", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setProducts(fallbackProducts);
          setUsingFallback(true);
        } else {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Product[];
          setProducts(data);
          setUsingFallback(false);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error leyendo productos de Firestore:", error);
        setProducts(fallbackProducts);
        setUsingFallback(true);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { products, loading, usingFallback };
}
