"use client";

import { useState } from "react";
import { Product, Category, ProductVariant } from "@/types";
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
      variants: product.variants || [],
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
    variants: [] as ProductVariant[],
  };
}

export default function ProductFormModal({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const [form, setForm] = useState(() => buildInitialForm(product, categories));
  const [badgesInput, setBadgesInput] = useState(() => (product?.badges || []).join(", "));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const badges = badgesInput.split(",").map((b) => b.trim()).filter(Boolean);
    onSave({
      ...form,
      image: form.image || "/placeholder-chicken.svg",
      badges,
      variants: form.variants.length > 0 ? form.variants : undefined,
    });
  };

  const addVariant = () => {
    setForm({ ...form, variants: [...form.variants, { name: "", extraPrice: 0 }] });
  };

  const updateVariant = (idx: number, field: keyof ProductVariant, value: string | number) => {
    const updated = form.variants.map((v, i) => i === idx ? { ...v, [field]: value } : v);
    setForm({ ...form, variants: updated });
  };

  const removeVariant = (idx: number) => {
    setForm({ ...form, variants: form.variants.filter((_, i) => i !== idx) });
  };

  const ic = "w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-coal/50 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-cream w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto thin-scrollbar">
        <div className="flex items-center justify-between p-5 border-b border-coal/10 sticky top-0 bg-cream">
          <h2 className="font-display text-xl font-bold">{product ? "Editar producto" : "Nuevo producto"}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-coal/5">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Foto</label>
            <ImageUpload value={form.image} onChange={(image) => setForm({ ...form, image })} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Nombre</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={ic} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Descripción</label>
            <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={ic + " resize-none"} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Precio base ($)</label>
              <input type="number" required min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={ic} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Categoría</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={ic}>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Etiquetas (separadas por coma)</label>
            <input type="text" placeholder="Ej: Nuevo, Picante, Más vendido" value={badgesInput} onChange={(e) => setBadgesInput(e.target.value)} className={ic} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">Variantes (opcional)</label>
              <button type="button" onClick={addVariant} className="text-xs font-bold text-ember hover:text-chili">+ Agregar variante</button>
            </div>
            <p className="text-xs text-coal/50 mb-2">Ej: Doble, Triple. El precio base es la variante Simple.</p>
            {form.variants.map((variant, idx) => (
              <div key={idx} className="flex gap-2 items-center mb-2">
                <input type="text" placeholder="Nombre (ej: Doble)" value={variant.name} onChange={(e) => updateVariant(idx, "name", e.target.value)} className="flex-1 border border-coal/15 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ember" />
                <input type="number" placeholder="Precio extra" min={0} value={variant.extraPrice} onChange={(e) => updateVariant(idx, "extraPrice", Number(e.target.value))} className="w-28 border border-coal/15 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ember" />
                <button type="button" onClick={() => removeVariant(idx)} className="text-coal/40 hover:text-chili text-lg w-8">✕</button>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="w-5 h-5 accent-ember" />
            <span className="text-sm font-semibold">Disponible para pedir</span>
          </label>

          <button type="submit" className="w-full bg-ember hover:bg-chili transition-colors text-cream font-bold py-3 rounded-xl">
            {product ? "Guardar cambios" : "Crear producto"}
          </button>
        </form>
      </div>
    </div>
  );
}
