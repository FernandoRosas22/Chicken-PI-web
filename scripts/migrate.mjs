// Script de migración: carga categorías, productos, promociones y
// configuración inicial a Firestore. Correr una sola vez con:
//
//   node scripts/migrate.mjs
//
// Requiere las variables de entorno NEXT_PUBLIC_FIREBASE_* (las de .env.local).

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Datos a migrar (copia plana de src/data, sin imports de TS) ---

const categories = [
  { id: "presas", name: "Presas y Combos", order: 1 },
  { id: "sandwiches", name: "Sándwiches", order: 2 },
  { id: "acompanamientos", name: "Acompañamientos", order: 3 },
  { id: "bebidas", name: "Bebidas", order: 4 },
  { id: "postres", name: "Postres", order: 5 },
];

const products = [
  { id: "presa-individual", name: "Presa Individual", description: "Una presa de pollo frito crocante, a elección (pata, muslo o pechuga).", price: 3200, image: "/placeholder-chicken.svg", categoryId: "presas", badges: ["Crispy"], available: true, order: 1 },
  { id: "combo-2-presas", name: "Combo 2 Presas", description: "2 presas de pollo frito + papas fritas + bebida 500ml.", price: 7800, image: "/placeholder-chicken.svg", categoryId: "presas", badges: ["Más vendido"], available: true, order: 2 },
  { id: "combo-4-presas", name: "Combo 4 Presas", description: "4 presas de pollo frito + papas fritas grandes + 2 bebidas 500ml.", price: 14500, image: "/placeholder-chicken.svg", categoryId: "presas", badges: ["Para compartir"], available: true, order: 3 },
  { id: "balde-8-presas", name: "Balde Familiar 8 Presas", description: "8 presas de pollo frito + papas fritas grandes + nuggets + 1.5L bebida.", price: 26900, image: "/placeholder-chicken.svg", categoryId: "presas", badges: ["Familiar"], available: true, order: 4 },
  { id: "sandwich-clasico", name: "Sándwich Clásico de Pollo", description: "Filet de pollo crocante, lechuga, tomate y mayonesa en pan brioche.", price: 5200, image: "/placeholder-sandwich.svg", categoryId: "sandwiches", badges: [], available: true, order: 1 },
  { id: "sandwich-picante", name: "Sándwich Picante", description: "Filet de pollo crocante bañado en salsa picante, pickles y mayo chipotle.", price: 5600, image: "/placeholder-sandwich.svg", categoryId: "sandwiches", badges: ["Picante"], available: true, order: 2 },
  { id: "sandwich-cheddar", name: "Sándwich Doble Cheddar", description: "Filet de pollo crocante, doble cheddar, bacon y salsa barbacoa.", price: 6100, image: "/placeholder-sandwich.svg", categoryId: "sandwiches", badges: ["Nuevo"], available: true, order: 3 },
  { id: "papas-fritas", name: "Papas Fritas", description: "Papas fritas crocantes, porción grande.", price: 2800, image: "/placeholder-side.svg", categoryId: "acompanamientos", badges: [], available: true, order: 1 },
  { id: "nuggets-6", name: "Nuggets de Pollo (6 unidades)", description: "6 nuggets de pollo crocantes, con salsa a elección.", price: 3400, image: "/placeholder-side.svg", categoryId: "acompanamientos", badges: [], available: true, order: 2 },
  { id: "aros-cebolla", name: "Aros de Cebolla", description: "Aros de cebolla rebozados y fritos, porción grande.", price: 2900, image: "/placeholder-side.svg", categoryId: "acompanamientos", badges: [], available: true, order: 3 },
  { id: "coleslaw", name: "Coleslaw", description: "Ensalada de repollo fresca, estilo americano.", price: 2200, image: "/placeholder-side.svg", categoryId: "acompanamientos", badges: [], available: true, order: 4 },
  { id: "gaseosa-500", name: "Gaseosa 500ml", description: "Línea Coca-Cola, a elección.", price: 1800, image: "/placeholder-drink.svg", categoryId: "bebidas", badges: [], available: true, order: 1 },
  { id: "agua-500", name: "Agua Mineral 500ml", description: "Con o sin gas.", price: 1500, image: "/placeholder-drink.svg", categoryId: "bebidas", badges: [], available: true, order: 2 },
  { id: "limonada", name: "Limonada Casera", description: "Limonada fresca con menta, 500ml.", price: 2100, image: "/placeholder-drink.svg", categoryId: "bebidas", badges: ["Casera"], available: true, order: 3 },
  { id: "brownie", name: "Brownie con Helado", description: "Brownie de chocolate tibio con bocha de helado de vainilla.", price: 3300, image: "/placeholder-dessert.svg", categoryId: "postres", badges: [], available: true, order: 1 },
  { id: "cheesecake", name: "Cheesecake de Frutos Rojos", description: "Porción de cheesecake con coulis de frutos rojos.", price: 3500, image: "/placeholder-dessert.svg", categoryId: "postres", badges: ["Nuevo"], available: true, order: 2 },
];

const promotions = [
  { id: "promo-martes", title: "Martes de 2x1 en presas", description: "Todos los martes, 2x1 en presas individuales. Solo en el local.", active: true, order: 1 },
  { id: "promo-combo-familiar", title: "Combo Familiar con 15% OFF", description: "Pedís el Balde Familiar por WhatsApp y te lo dejamos con 15% de descuento.", active: true, order: 2 },
];

const defaultHours = { open: "19:00", close: "23:30", closed: false };

const business = {
  name: "Chicken PI",
  tagline: "Pollo frito bien crispy",
  description: "Pollo frito crocante, hecho al momento. Take away y delivery en Merlo.",
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

async function migrate() {
  console.log("Conectando a Firestore proyecto:", firebaseConfig.projectId);

  console.log(`Migrando ${categories.length} categorías...`);
  for (const cat of categories) {
    const { id, ...data } = cat;
    await setDoc(doc(db, "categories", id), data);
  }

  console.log(`Migrando ${products.length} productos...`);
  for (const product of products) {
    const { id, ...data } = product;
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    );
    await setDoc(doc(db, "products", id), clean);
  }

  console.log(`Migrando ${promotions.length} promociones...`);
  for (const promo of promotions) {
    const { id, ...data } = promo;
    await setDoc(doc(db, "promotions", id), data);
  }

  console.log("Migrando configuración del negocio...");
  await setDoc(doc(db, "businessSettings", "main"), business);

  console.log("✅ Migración completa.");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Error en la migración:", err);
  process.exit(1);
});
