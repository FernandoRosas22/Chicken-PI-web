"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { usePromotions } from "@/hooks/usePromotions";

export default function AdminDashboard() {
  const { products, usingFallback } = useProducts();
  const { categories } = useCategories();
  const { promotions } = usePromotions();

  const availableCount = products.filter((p) => p.available).length;

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
        Dashboard
      </h1>
      <p className="text-coal/60 mb-8">
        Bienvenida de nuevo. Acá tenés un resumen de tu negocio.
      </p>

      {usingFallback && (
        <div className="bg-mustard/20 border border-mustard text-coal text-sm rounded-xl p-4 mb-6">
          Todavía no cargaste productos en la base de datos: el sitio está
          mostrando el menú de ejemplo. Entrá a{" "}
          <Link href="/admin/productos" className="font-bold underline">
            Productos
          </Link>{" "}
          para cargar los tuyos.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Productos" value={products.length} icon="🍗" />
        <StatCard label="Disponibles" value={availableCount} icon="✅" />
        <StatCard label="Categorías" value={categories.length} icon="🏷️" />
        <StatCard label="Promos activas" value={promotions.length} icon="🔥" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <QuickLink
          href="/admin/productos"
          title="Agregar un producto"
          description="Sumá un nuevo plato al menú con foto y precio."
        />
        <QuickLink
          href="/admin/promociones"
          title="Crear una promoción"
          description="Anunciá una oferta en la web de tus clientes."
        />
        <QuickLink
          href="/admin/configuracion"
          title="Editar datos del negocio"
          description="Horarios, WhatsApp, dirección y redes."
        />
        <QuickLink
          href="/admin/categorias"
          title="Organizar categorías"
          description="Ordená cómo se agrupa tu menú."
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-coal/10">
      <span className="text-2xl">{icon}</span>
      <p className="font-display text-2xl font-bold mt-1">{value}</p>
      <p className="text-coal/60 text-sm">{label}</p>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl p-5 border border-coal/10 hover:border-ember transition-colors block"
    >
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-coal/60 text-sm">{description}</p>
    </Link>
  );
}
