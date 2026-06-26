import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chicken-pi.vercel.app"),
  title: "Chicken PI | Pollo Frito en Merlo",
  description:
    "Pollo frito crocante hecho al momento. Take away y delivery en Merlo, Buenos Aires. Pedidos por WhatsApp.",
  keywords: [
    "pollo frito Merlo",
    "delivery pollo Merlo",
    "Chicken PI",
    "comida rápida Merlo",
  ],
  openGraph: {
    title: "Chicken PI | Pollo Frito en Merlo",
    description:
      "Pollo frito crocante hecho al momento. Take away y delivery en Merlo, Buenos Aires.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Chicken PI",
    servesCuisine: "Pollo frito",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Merlo",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    priceRange: "$$",
  };

  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-coal">
        {children}
      </body>
    </html>
  );
}
