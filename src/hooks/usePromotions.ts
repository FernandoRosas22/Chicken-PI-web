"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Promotion } from "@/types";
import { promotions as fallbackPromotions } from "@/data/promotions";

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>(fallbackPromotions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "promotions"), orderBy("order", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setPromotions(fallbackPromotions);
        } else {
          const data = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }) as Promotion)
            .filter((p) => p.active);
          setPromotions(data);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error leyendo promociones de Firestore:", error);
        setPromotions(fallbackPromotions);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { promotions, loading };
}
