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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { db } from "@/lib/firebase";
import { Category } from "@/types";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

function SortableCategoryRow({
  category,
  productCount,
  onRename,
  onDelete,
}: {
  category: Category;
  productCount: number;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: category.id });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (name.trim()) {
      onRename(name.trim());
    } else {
      setName(category.name);
    }
    setEditing(false);
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

      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="flex-1 border border-ember rounded-lg px-2 py-1 text-sm font-semibold focus:outline-none"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="flex-1 text-left font-semibold text-sm"
        >
          {category.name}
        </button>
      )}

      <span className="text-coal/50 text-xs whitespace-nowrap">
        {productCount} {productCount === 1 ? "producto" : "productos"}
      </span>

      <button
        onClick={onDelete}
        aria-label="Eliminar categoría"
        className="w-8 h-8 flex items-center justify-center text-coal/50 hover:text-chili shrink-0"
      >
        🗑️
      </button>
    </div>
  );
}

export default function AdminCategoriasPage() {
  const { categories } = useCategories();
  const { products } = useProducts();
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), 0);
      await addDoc(collection(db, "categories"), {
        name: newName.trim(),
        order: maxOrder + 1,
      });
      setNewName("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("No pudimos crear la categoría.");
    }
  };

  const handleRename = async (category: Category, name: string) => {
    try {
      await updateDoc(doc(db, "categories", category.id), { name });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (category: Category) => {
    const productCount = products.filter((p) => p.categoryId === category.id).length;
    if (productCount > 0) {
      alert(
        `No podés eliminar "${category.name}" porque tiene ${productCount} producto(s). Movélos a otra categoría primero.`
      );
      return;
    }
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    try {
      await deleteDoc(doc(db, "categories", category.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sorted.findIndex((c) => c.id === active.id);
    const newIndex = sorted.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex);

    try {
      const batch = writeBatch(db);
      reordered.forEach((cat, index) => {
        batch.update(doc(db, "categories", cat.id), { order: index + 1 });
      });
      await batch.commit();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6">
        Categorías
      </h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className="flex-1 border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
        />
        <button
          type="submit"
          className="bg-ember hover:bg-chili transition-colors text-cream font-bold px-5 py-2.5 rounded-xl whitespace-nowrap"
        >
          Agregar
        </button>
      </form>

      {error && <p className="text-chili text-sm mb-4">{error}</p>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sorted.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sorted.map((cat) => (
              <SortableCategoryRow
                key={cat.id}
                category={cat}
                productCount={products.filter((p) => p.categoryId === cat.id).length}
                onRename={(name) => handleRename(cat, name)}
                onDelete={() => handleDelete(cat)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
