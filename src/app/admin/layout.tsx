"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/productos", label: "Productos", icon: "🍗" },
  { href: "/admin/categorias", label: "Categorías", icon: "🏷️" },
  { href: "/admin/promociones", label: "Promociones", icon: "🔥" },
  { href: "/admin/configuracion", label: "Configuración", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [loading, user, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-coal/50">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-cream-dark">
      {/* Nav desktop lateral */}
      <aside className="hidden sm:flex sm:flex-col w-60 bg-coal text-cream shrink-0 p-5">
        <h1 className="font-display text-xl font-black text-mustard mb-8">
          Chicken PI
        </h1>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === item.href
                  ? "bg-ember text-cream"
                  : "text-cream/70 hover:bg-cream/10"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="text-cream/60 hover:text-cream text-sm font-semibold text-left px-3 py-2"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-4 sm:p-8 pb-24 sm:pb-8 overflow-x-hidden">
        {children}
      </main>

      {/* Nav mobile inferior */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-coal flex justify-around py-2 z-40">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-semibold ${
              pathname === item.href ? "text-mustard" : "text-cream/60"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
