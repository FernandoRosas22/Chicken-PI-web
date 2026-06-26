import { BusinessSettings } from "@/types";

const defaultHours = { open: "19:00", close: "23:30", closed: false };

export const business: BusinessSettings = {
  name: "Chicken PI",
  tagline: "Pollo frito bien crispy",
  description:
    "Pollo frito crocante, hecho al momento. Take away y delivery en Merlo.",
  whatsappNumber: "5491164187474",
  address: "Merlo, Buenos Aires",
  logo: "/logo.png",
  heroImage: "/hero-chicken.jpg",
  social: {
    instagram: "https://www.instagram.com/chickenpi2025",
    facebook: "",
  },
  hours: {
    monday: defaultHours,
    tuesday: defaultHours,
    wednesday: defaultHours,
    thursday: defaultHours,
    friday: defaultHours,
    saturday: defaultHours,
    sunday: { ...defaultHours, closed: false },
  },
  deliveryFee: 0,
  minOrderAmount: 0,
};

export default business;
