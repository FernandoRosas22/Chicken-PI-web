import { CartItem } from "@/types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Construye la URL de WhatsApp para realizar un pedido.
 * Recibe el número como parámetro (no lo importa directamente)
 * para mantener la función testeable y desacoplada.
 */
export function buildWhatsAppUrl(
  whatsappNumber: string,
  items: CartItem[],
  customerName?: string
): string {
  const lines: string[] = [];

  lines.push(`¡Hola! Quiero hacer un pedido en Chicken PI:`);
  lines.push("");

  items.forEach((item) => {
    lines.push(
      `• ${item.quantity}x ${item.product.name} - ${formatPrice(
        item.product.price * item.quantity
      )}`
    );
  });

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  lines.push("");
  lines.push(`Total: ${formatPrice(total)}`);

  if (customerName) {
    lines.push("");
    lines.push(`Nombre: ${customerName}`);
  }

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
