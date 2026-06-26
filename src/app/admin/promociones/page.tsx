"use client";

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Promotion } from "@/types";

function usePromotionsAdmin() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  useEffect(() => {
    const q = query(collection(db, "promotions"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPromotions(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Promotion)
      );
    });
    return () => unsubscribe();
  }, []);
  return promotions;
}

const emptyForm = { title: "", description: "", active: true };

export default function AdminPromocionesPage() {
  const promotions = usePromotionsAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (promo: Promotion) => {
    setEditing(promo);
    setForm({
      title: promo.title,
      description: promo.description,
      active: promo.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await updateDoc(doc(db, "promotions", editing.id), { ...form });
      } else {
        const maxOrder = promotions.reduce((max, p) => Math.max(max, p.order), 0);
        await addDoc(collection(db, "promotions"), {
          ...form,
          order: maxOrder + 1,
        });
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError("No pudimos guardar la promoción.");
    }
  };

  const handleDelete = async (promo: Promotion) => {
    if (!confirm(`¿Eliminar la promoción "${promo.title}"?`)) return;
    try {
      await deleteDoc(doc(db, "promotions", promo.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (promo: Promotion) => {
    try {
      await updateDoc(doc(db, "promotions", promo.id), {
        active: !promo.active,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">
          Promociones
        </h1>
        <button
          onClick={openNew}
          className="bg-ember hover:bg-chili transition-colors text-cream font-bold px-4 py-2.5 rounded-xl text-sm whitespace-nowrap"
        >
          + Nueva promo
        </button>
      </div>

      {promotions.length === 0 ? (
        <p className="text-coal/50 text-center py-10">
          Todavía no creaste ninguna promoción.
        </p>
      ) : (
        <div className="space-y-3">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-xl border border-coal/10 p-4 flex items-start gap-3"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{promo.title}</h3>
                <p className="text-coal/60 text-sm">{promo.description}</p>
              </div>
              <button
                onClick={() => handleToggleActive(promo)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                  promo.active
                    ? "bg-green-100 text-green-700"
                    : "bg-coal/10 text-coal/50"
                }`}
              >
                {promo.active ? "Activa" : "Inactiva"}
              </button>
              <button
                onClick={() => openEdit(promo)}
                aria-label="Editar"
                className="w-8 h-8 flex items-center justify-center text-coal/50 hover:text-ember shrink-0"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(promo)}
                aria-label="Eliminar"
                className="w-8 h-8 flex items-center justify-center text-coal/50 hover:text-chili shrink-0"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-coal/50 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cream w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-5"
          >
            <h2 className="font-display text-xl font-bold mb-4">
              {editing ? "Editar promoción" : "Nueva promoción"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Título
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
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
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="w-5 h-5 accent-ember"
                />
                <span className="text-sm font-semibold">
                  Mostrar en la web
                </span>
              </label>
              {error && <p className="text-chili text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-ember hover:bg-chili transition-colors text-cream font-bold py-3 rounded-xl"
              >
                {editing ? "Guardar cambios" : "Crear promoción"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
