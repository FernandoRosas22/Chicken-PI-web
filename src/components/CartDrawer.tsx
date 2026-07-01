"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CartItem } from "@/types";
import { formatPrice, buildWhatsAppUrl, CheckoutData } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  whatsappNumber: string;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

const emptyCheckout: CheckoutData = {
  customerName: "",
  phone: "",
  address: "",
  paymentMethod: "Efectivo",
};

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  whatsappNumber,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutData>(emptyCheckout);

  const total = items.reduce(
    (sum, item) => sum + (item.product.price + (item.variantExtraPrice || 0)) * item.quantity,
    0
  );

  const handleCheckout = () => {
    const url = buildWhatsAppUrl(whatsappNumber, items, checkout);
    window.open(url, "_blank");
    onClearCart();
    setCheckoutOpen(false);
    setCheckout(emptyCheckout);
    onClose();
  };

  const ic = "w-full border border-coal/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ember bg-white";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-coal/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-cream flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-coal/10">
              <h2 className="font-display text-xl font-bold">Tu pedido</h2>
              <button onClick={onClose} aria-label="Cerrar carrito" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-coal/5">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto thin-scrollbar p-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-coal/50">
                  <span className="text-5xl mb-3">🍗</span>
                  <p>Tu carrito está vacío.</p>
                  <p className="text-sm">Agregá algo rico del menú!</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item, idx) => (
                    <li key={item.product.id + (item.variantName || "") + idx} className="flex gap-3 items-start border-b border-coal/5 pb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm leading-tight">
                          {item.product.name}{item.variantName && <span className="ml-1 text-ember font-normal">({item.variantName})</span>}
                        </h3>
                        <span className="text-ember font-bold text-sm">{formatPrice(item.product.price + (item.variantExtraPrice || 0))}</span>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-coal/15 rounded-lg">
                            <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-sm font-bold" aria-label="Restar">−</button>
                            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-sm font-bold" aria-label="Sumar">+</button>
                          </div>
                          <button onClick={() => onRemoveItem(item.product.id)} className="text-xs text-coal/40 hover:text-chili underline">Quitar</button>
                        </div>
                      </div>
                      <span className="font-bold text-sm whitespace-nowrap">{formatPrice((item.product.price + (item.variantExtraPrice || 0)) * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <div className="p-5 border-t border-coal/10 shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-coal/70">Total</span>
                  <span className="font-display text-2xl font-bold text-ember">{formatPrice(total)}</span>
                </div>
                {!checkoutOpen ? (
                  <button onClick={() => setCheckoutOpen(true)} className="w-full bg-ember hover:bg-chili transition-colors text-cream font-bold py-3.5 rounded-xl">Continuar pedido</button>
                ) : (
                  <div className="space-y-3">
                    <input type="text" value={checkout.customerName} onChange={(e) => setCheckout({ ...checkout, customerName: e.target.value })} placeholder="Tu nombre *" className={ic} />
                    <input type="tel" value={checkout.phone} onChange={(e) => setCheckout({ ...checkout, phone: e.target.value })} placeholder="Teléfono *" className={ic} />
                    <input type="text" value={checkout.address} onChange={(e) => setCheckout({ ...checkout, address: e.target.value })} placeholder="Dirección de entrega *" className={ic} />
                    <select value={checkout.paymentMethod} onChange={(e) => setCheckout({ ...checkout, paymentMethod: e.target.value })} className={ic}>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Débito">Débito</option>
                    </select>
                    <button onClick={handleCheckout} disabled={!checkout.customerName || !checkout.phone || !checkout.address} className="w-full bg-[#25D366] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">Enviar pedido por WhatsApp</button>
                    <button onClick={() => setCheckoutOpen(false)} className="w-full text-center text-sm text-coal/50 hover:text-coal">Volver al carrito</button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
