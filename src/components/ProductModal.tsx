"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    variantName?: string,
    variantExtraPrice?: number
  ) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  if (!product) return null;

  const hasVariants = product.variants && product.variants.length > 0;
  const extraPrice = selectedVariant ? selectedVariant.extraPrice : 0;
  const unitPrice = product.price + extraPrice;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(
      product,
      quantity,
      selectedVariant ? selectedVariant.name : undefined,
      selectedVariant ? selectedVariant.extraPrice : undefined
    );
    setQuantity(1);
    setSelectedVariant(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-coal/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-cream w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="relative h-48 bg-cream-dark flex items-center justify-center shrink-0">
              {product.image?.startsWith("/placeholder") ? (
                <span className="text-6xl" role="img" aria-label={product.name}>
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
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-coal/70 text-cream flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto thin-scrollbar">
              <h2 className="font-display text-2xl font-bold mb-2">
                {product.name}
              </h2>
              <p className="text-coal/70 mb-4">{product.description}</p>

              <span className="font-bold text-ember text-2xl">
                {formatPrice(unitPrice)}
              </span>
              {extraPrice > 0 && (
                <span className="text-coal/50 text-sm ml-2">
                  (+{formatPrice(extraPrice)} por {selectedVariant?.name})
                </span>
              )}

              {hasVariants && (
                <div className="mt-5">
                  <p className="text-sm font-semibold mb-2">Elegí tu variante:</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedVariant(null)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${
                        !selectedVariant
                          ? "border-ember bg-ember text-cream"
                          : "border-coal/15 text-coal hover:border-ember"
                      }`}
                    >
                      Simple · {formatPrice(product.price)}
                    </button>
                    {product.variants!.map((variant) => (
                      <button
                        key={variant.name}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${
                          selectedVariant?.name === variant.name
                            ? "border-ember bg-ember text-cream"
                            : "border-coal/15 text-coal hover:border-ember"
                        }`}
                      >
                        {variant.name} · {formatPrice(product.price + variant.extraPrice)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-coal/10 flex items-center gap-4 shrink-0">
              <div className="flex items-center border-2 border-coal/15 rounded-xl">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-lg font-bold"
                  aria-label="Restar cantidad"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-lg font-bold"
                  aria-label="Sumar cantidad"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!product.available}
                className="flex-1 bg-ember hover:bg-chili disabled:bg-coal/20 disabled:cursor-not-allowed transition-colors text-cream font-bold py-3 rounded-xl"
              >
                {product.available
                  ? "Agregar · " + formatPrice(totalPrice)
                  : "Agotado"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
