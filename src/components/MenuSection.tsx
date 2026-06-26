"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/types";
import ProductCard from "./ProductCard";

interface MenuSectionProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
}

export default function MenuSection({
  products,
  categories,
  onSelectProduct,
}: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.categoryId === activeCategory);
  }, [products, activeCategory]);

  return (
    <section id="menu" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          Nuestro Menú
        </h2>
        <p className="text-coal/60">
          Todo hecho al momento, recién salido de la freidora.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
        <button
          onClick={() => setActiveCategory("all")}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
            activeCategory === "all"
              ? "bg-coal text-cream"
              : "bg-white text-coal/70 border border-coal/10 hover:border-ember"
          }`}
        >
          Todo
        </button>
        {categories
          .sort((a, b) => a.order - b.order)
          .map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                activeCategory === cat.id
                  ? "bg-coal text-cream"
                  : "bg-white text-coal/70 border border-coal/10 hover:border-ember"
              }`}
            >
              {cat.name}
            </button>
          ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-coal/50 py-10">
          No hay productos en esta categoría todavía.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts
            .sort((a, b) => a.order - b.order)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
        </div>
      )}
    </section>
  );
}
