import { Promotion } from "@/types";

export const promotions: Promotion[] = [
  {
    id: "promo-martes",
    title: "Martes de 2x1 en presas",
    description: "Todos los martes, 2x1 en presas individuales. Solo en el local.",
    active: true,
    order: 1,
  },
  {
    id: "promo-combo-familiar",
    title: "Combo Familiar con 15% OFF",
    description: "Pedís el Balde Familiar por WhatsApp y te lo dejamos con 15% de descuento.",
    active: true,
    order: 2,
  },
];

export default promotions;
