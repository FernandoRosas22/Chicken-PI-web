"use client";

import { useState } from "react";
import { BusinessSettings } from "@/types";

interface HeaderProps {
  business: BusinessSettings;
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({ business, cartCount, onCartClick }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b-2 border-coal/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2">
          {business.logo && business.logo !== "/logo.png" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo}
              alt={business.name}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="font-display text-2xl font-bold text-chili">
              {business.name}
            </span>
          )}
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a href="#menu" className="hover:text-ember transition-colors">
            Menú
          </a>
          <a href="#promos" className="hover:text-ember transition-colors">
            Promos
          </a>
          <a href="#ubicacion" className="hover:text-ember transition-colors">
            Ubicación
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onCartClick}
            aria-label="Ver carrito"
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-coal text-cream hover:bg-ember transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2.3 2.3a1 1 0 0 0 .7 1.7H17M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-chili text-cream text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden flex items-center justify-center w-10 h-10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-1 px-4 pb-4 text-sm font-semibold">
          <a
            href="#menu"
            className="py-2"
            onClick={() => setMenuOpen(false)}
          >
            Menú
          </a>
          <a
            href="#promos"
            className="py-2"
            onClick={() => setMenuOpen(false)}
          >
            Promos
          </a>
          <a
            href="#ubicacion"
            className="py-2"
            onClick={() => setMenuOpen(false)}
          >
            Ubicación
          </a>
        </nav>
      )}
    </header>
  );
}
