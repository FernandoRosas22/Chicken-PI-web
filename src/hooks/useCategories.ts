"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Category } from "@/types";
import { categories as fallbackCategories } from "@/data/categories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("order", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setCategories(fallbackCategories);
        } else {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Category[];
          setCategories(data);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error leyendo categorías de Firestore:", error);
        setCategories(fallbackCategories);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { categories, loading };
}
