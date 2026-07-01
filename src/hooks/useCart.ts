"use client";

import { useEffect, useState, useCallback } from "react";
import { CartItem, Product } from "@/types";

const STORAGE_KEY = "chickenpi_cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, quantity: number = 1, variantName?: string, variantExtraPrice?: number) => {
    setItems((prev) => {
      const key = product.id + (variantName || "");
      const existing = prev.find((item) => item.product.id + (item.variantName || "") === key);
      if (existing) {
        return prev.map((item) =>
          item.product.id + (item.variantName || "") === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, variantName, variantExtraPrice }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) => prev.map((item) => item.product.id === productId ? { ...item, quantity } : item));
  }, []);

  const clearCart = useCallback(() => { setItems([]); }, []);

  const total = items.reduce((sum, item) => sum + (item.product.price + (item.variantExtraPrice || 0)) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount };
}
