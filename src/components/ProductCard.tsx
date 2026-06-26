"use client";

import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(product)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="text-left bg-white rounded-2xl overflow-hidden border border-coal/10 shadow-sm hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="relative h-40 bg-cream-dark flex items-center justify-center overflow-hidden">
        {product.image?.startsWith("/placeholder") ? (
          <span className="text-5xl" role="img" aria-label={product.name}>
            🍗
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="bg-chili text-cream text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-coal/60 flex items-center justify-center">
            <span className="text-cream text-xs font-bold uppercase">
              Agotado
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-base leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-coal/60 text-sm line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>
        <span className="font-bold text-ember text-lg">
          {formatPrice(product.price)}
        </span>
      </div>
    </motion.button>
  );
}
