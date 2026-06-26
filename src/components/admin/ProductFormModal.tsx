"use client";

import { useState } from "react";
import { Product, Category } from "@/types";
import ImageUpload from "./ImageUpload";

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Product, "id" | "order">) => void;
}

function buildInitialForm(product: Product | null, categories: Category[]) {
  if (product) {
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      categoryId: product.categoryId,
      badges: product.badges || [],
      available: product.available,
    };
  }
  return {
    name: "",
    description: "",
    price: 0,
    image: "",
    categoryId: categories[0]?.id || "",
    badges: [] as string[],
    available: true,
  };
}

export default function ProductFormModal({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}: ProductFormModalProps) {
  // El estado se inicializa una sola vez por apertura del modal. El padre
  // (AdminProductosPage) le pasa una `key` distinta cada vez que cambia el
  // producto a editar, lo que remonta este componente con datos frescos
  // en vez de sincronizar vía useEffect (evita cascading renders).
  const [form, setForm] = useState(() => buildInitialForm(product, categories));
  const [badgesInput, setBadgesInput] = useState(() =>
    (product?.badges || []).join(", ")
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const badges = badgesInput
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    onSave({
      ...form,
      image: form.image || "/placeholder-chicken.svg",
      badges,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-coal/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-cream w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto thin-scrollbar"
      >
        <div className="flex items-center justify-between p-5 border-b border-coal/10 sticky top-0 bg-cream">
          <h2 className="font-display text-xl font-bold">
            {product ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-coal/5"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Foto</label>
            <ImageUpload
              value={form.image}
              onChange={(image) => setForm({ ...form, image })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Nombre
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Descripción
            </label>
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Precio ($)
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Categoría
              </label>
              <select
                required
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              placeholder="Ej: Nuevo, Picante, Más vendido"
              value={badgesInput}
              onChange={(e) => setBadgesInput(e.target.value)}
              className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) =>
                setForm({ ...form, available: e.target.checked })
              }
              className="w-5 h-5 accent-ember"
            />
            <span className="text-sm font-semibold">
              Disponible para pedir
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-ember hover:bg-chili transition-colors text-cream font-bold py-3 rounded-xl"
          >
            {product ? "Guardar cambios" : "Crear producto"}
          </button>
        </form>
      </div>
    </div>
  );
}
