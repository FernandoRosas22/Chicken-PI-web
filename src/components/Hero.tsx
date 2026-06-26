"use client";

import { motion } from "framer-motion";
import { BusinessSettings } from "@/types";

interface HeroProps {
  business: BusinessSettings;
}

export default function Hero({ business }: HeroProps) {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-coal text-cream"
    >
      {/* Textura de fondo: puntos tipo "pana/empanado" sutil */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-mustard) 1.5px, transparent 1.5px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-ember text-cream text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
            {business.tagline}
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-black leading-[0.95] mb-5">
            Crocante
            <br />
            <span className="text-mustard">por fuera.</span>
            <br />
            Jugoso por dentro.
          </h1>
          <p className="text-cream/80 text-lg max-w-md mb-8">
            {business.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#menu"
              className="inline-flex items-center justify-center bg-ember hover:bg-chili transition-colors text-cream font-bold px-7 py-3.5 rounded-xl text-base"
            >
              Ver el menú
            </a>
            <a
              href={`https://wa.me/${business.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-transparent border-2 border-cream/30 hover:border-mustard transition-colors text-cream font-bold px-7 py-3.5 rounded-xl text-base"
            >
              Pedir por WhatsApp
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative flex justify-center"
        >
          <div className="crispy-edge w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-mustard to-ember flex items-center justify-center shadow-2xl">
            <span className="text-7xl sm:text-8xl" role="img" aria-label="Pollo frito">
              🍗
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
