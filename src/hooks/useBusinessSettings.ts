"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BusinessSettings } from "@/types";
import { business as fallbackBusiness } from "@/data/business";

export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings>(fallbackBusiness);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "businessSettings", "main");

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<BusinessSettings>;
          // Merge campo por campo para no perder defaults si falta algo en Firestore
          setSettings({
            ...fallbackBusiness,
            ...data,
            social: { ...fallbackBusiness.social, ...data.social },
            hours: { ...fallbackBusiness.hours, ...data.hours },
          });
        } else {
          setSettings(fallbackBusiness);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error leyendo configuración de Firestore:", error);
        setSettings(fallbackBusiness);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { settings, loading };
}
