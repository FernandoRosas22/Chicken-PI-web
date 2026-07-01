"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { usePromotions } from "@/hooks/usePromotions";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { useCart } from "@/hooks/useCart";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromotionsBanner from "@/components/PromotionsBanner";
import MenuSection from "@/components/MenuSection";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  const { settings: business } = useBusinessSettings();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { promotions } = usePromotions();
  const cart = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header
        business={business}
        cartCount={cart.itemCount}
        onCartClick={() => setCartOpen(true)}
      />

      <main className="flex-1">
        <Hero business={business} />
        <PromotionsBanner promotions={promotions} />
        <MenuSection
          products={products}
          categories={categories}
          onSelectProduct={setSelectedProduct}
        />
        <TrustSection business={business} />
      </main>

      <Footer business={business} />

      <WhatsAppButton whatsappNumber={business.whatsappNumber} />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, quantity, variantName, variantExtraPrice) => cart.addItem(product, quantity, variantName, variantExtraPrice)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        whatsappNumber={business.whatsappNumber}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
      />
    </>
  );
}
