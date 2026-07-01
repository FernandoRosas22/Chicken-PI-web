import { CartItem } from "@/types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export interface CheckoutData {
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
}

export function buildWhatsAppUrl(
  whatsappNumber: string,
  items: CartItem[],
  checkout: CheckoutData
): string {
  const lines: string[] = [];

  lines.push("🛒 NUEVO PEDIDO");
  lines.push("");
  lines.push("Cliente:");
  lines.push(checkout.customerName || "No especificado");
  lines.push("");
  lines.push("Teléfono:");
  lines.push(checkout.phone || "No especificado");
  lines.push("");
  lines.push("Dirección:");
  lines.push(checkout.address || "No especificada");
  lines.push("");
  lines.push("PEDIDO");

  items.forEach((item) => {
    lines.push(
      "* " + item.product.name + " x" + item.quantity
    );
  });

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  lines.push("");
  lines.push("Total:");
  lines.push(
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(total)
  );
  lines.push("");
  lines.push("Forma de pago:");
  lines.push(checkout.paymentMethod || "No especificada");
  lines.push("");
  lines.push("Pedido generado desde Chicken PI Web");

  const message = encodeURIComponent(lines.join("\n"));
  return "https://wa.me/" + whatsappNumber + "?text=" + message;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
