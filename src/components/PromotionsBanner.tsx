"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Promotion } from "@/types";

interface PromotionsBannerProps {
  promotions: Promotion[];
}

export default function PromotionsBanner({ promotions }: PromotionsBannerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (promotions.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [promotions.length]);

  if (promotions.length === 0) return null;

  const current = promotions[index];

  return (
    <section id="promos" className="bg-mustard/15 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative h-28 sm:h-24 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col sm:flex-row sm:items-center gap-2 justify-center text-center sm:text-left"
            >
              <span className="text-3xl shrink-0">🔥</span>
              <div>
                <h3 className="font-display font-bold text-lg text-chili">
                  {current.title}
                </h3>
                <p className="text-coal/70 text-sm">{current.description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {promotions.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {promotions.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ver promoción ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === index ? "bg-ember" : "bg-coal/15"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
