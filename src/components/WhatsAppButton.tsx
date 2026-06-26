"use client";

import { motion } from "framer-motion";

interface WhatsAppButtonProps {
  whatsappNumber: string;
}

export default function WhatsAppButton({ whatsappNumber }: WhatsAppButtonProps) {
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "¡Hola! Quiero hacer un pedido en Chicken PI."
  )}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pedir por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-coal/20"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-1.747-.69-2.89-1.587-3.957-3.5-.299-.522-.299-.524.184-1.005.395-.39.453-.498.671-.886.219-.39.044-.522-.073-.886-.16-.444-.514-1.42-.673-1.95-.158-.522-.318-.45-.443-.46-.116-.01-.262-.012-.398-.012-.135 0-.349.05-.534.226-.184.176-.706.69-.706 1.685 0 .994.711 1.953.808 2.087.097.135 1.346 2.07 3.268 2.82 1.92.75 2.21.624 2.61.59.398-.034 1.288-.527 1.467-.999.18-.472.18-.875.126-.96-.054-.085-.198-.135-.498-.285z" />
        <path d="M12.005 2C6.484 2 2 6.477 2 11.99c0 1.99.587 3.84 1.6 5.394L2.5 21.5l4.243-1.11A9.95 9.95 0 0 0 12.005 22C17.524 22 22 17.523 22 12.01 22 6.5 17.524 2 12.005 2zm0 18.166a8.16 8.16 0 0 1-4.166-1.14l-.299-.176-3.094.81.825-3.02-.193-.31a8.15 8.15 0 0 1-1.252-4.34c0-4.515 3.674-8.183 8.184-8.183 4.51 0 8.184 3.668 8.184 8.183 0 4.516-3.674 8.176-8.189 8.176z" />
      </svg>
    </motion.a>
  );
}
