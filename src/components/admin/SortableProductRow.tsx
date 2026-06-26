"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface SortableProductRowProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailable: () => void;
}

export default function SortableProductRow({
  product,
  onEdit,
  onDelete,
  onToggleAvailable,
}: SortableProductRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white rounded-xl border border-coal/10 p-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-coal/30 px-1"
        aria-label="Reordenar"
      >
        ⠿
      </button>

      <div className="w-12 h-12 rounded-lg bg-cream-dark flex items-center justify-center shrink-0 overflow-hidden">
        {product.image?.startsWith("/placeholder") ? (
          <span className="text-xl">🍗</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{product.name}</p>
        <p className="text-ember font-bold text-sm">
          {formatPrice(product.price)}
        </p>
      </div>

      <button
        onClick={onToggleAvailable}
        className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
          product.available
            ? "bg-green-100 text-green-700"
            : "bg-coal/10 text-coal/50"
        }`}
      >
        {product.available ? "Disponible" : "Agotado"}
      </button>

      <button
        onClick={onEdit}
        aria-label="Editar"
        className="w-8 h-8 flex items-center justify-center text-coal/50 hover:text-ember shrink-0"
      >
        ✏️
      </button>
      <button
        onClick={onDelete}
        aria-label="Eliminar"
        className="w-8 h-8 flex items-center justify-center text-coal/50 hover:text-chili shrink-0"
      >
        🗑️
      </button>
    </div>
  );
}
