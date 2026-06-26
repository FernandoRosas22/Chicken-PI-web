"use client";

import { useState } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { db } from "@/lib/firebase";
import { Product } from "@/types";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ProductFormModal from "@/components/admin/ProductFormModal";
import SortableProductRow from "@/components/admin/SortableProductRow";

export default function AdminProductosPage() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const filtered = products
    .filter((p) => filterCategory === "all" || p.categoryId === filterCategory)
    .sort((a, b) => a.order - b.order);

  const handleOpenNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSave = async (data: Omit<Product, "id" | "order">) => {
    setSaving(true);
    setError("");
    try {
      // Filtramos cualquier campo undefined antes de escribir: Firestore
      // rechaza documentos con valores undefined.
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined)
      );

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), {
          ...cleanData,
          updatedAt: Date.now(),
        });
      } else {
        const maxOrder = products.reduce((max, p) => Math.max(max, p.order), 0);
        await addDoc(collection(db, "products"), {
          ...cleanData,
          order: maxOrder + 1,
          createdAt: Date.now(),
        });
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError("No pudimos guardar el producto. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, "products", product.id));
    } catch (err) {
      console.error(err);
      alert("No pudimos eliminar el producto. Probá de nuevo.");
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    try {
      await updateDoc(doc(db, "products", product.id), {
        available: !product.available,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((p) => p.id === active.id);
    const newIndex = filtered.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(filtered, oldIndex, newIndex);

    try {
      const batch = writeBatch(db);
      reordered.forEach((product, index) => {
        batch.update(doc(db, "products", product.id), { order: index + 1 });
      });
      await batch.commit();
    } catch (err) {
      console.error("Error reordenando productos:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">
          Productos
        </h1>
        <button
          onClick={handleOpenNew}
          className="bg-ember hover:bg-chili transition-colors text-cream font-bold px-4 py-2.5 rounded-xl text-sm whitespace-nowrap"
        >
          + Nuevo producto
        </button>
      </div>

      {error && (
        <p className="text-chili text-sm font-medium mb-4">{error}</p>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        <button
          onClick={() => setFilterCategory("all")}
          className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-bold ${
            filterCategory === "all"
              ? "bg-coal text-cream"
              : "bg-white border border-coal/10"
          }`}
        >
          Todo
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-bold ${
              filterCategory === cat.id
                ? "bg-coal text-cream"
                : "bg-white border border-coal/10"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-coal/50 text-center py-10">
          No hay productos en esta categoría.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filtered.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {filtered.map((product) => (
                <SortableProductRow
                  key={product.id}
                  product={product}
                  onEdit={() => handleOpenEdit(product)}
                  onDelete={() => handleDelete(product)}
                  onToggleAvailable={() => handleToggleAvailable(product)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ProductFormModal
        key={editingProduct?.id || "new"}
        product={editingProduct}
        categories={categories}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      {saving && (
        <div className="fixed inset-0 bg-coal/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl px-6 py-4 font-semibold">
            Guardando...
          </div>
        </div>
      )}
    </div>
  );
}
