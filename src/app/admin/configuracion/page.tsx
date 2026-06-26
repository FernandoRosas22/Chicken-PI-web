"use client";

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { BusinessSettings, BusinessHours } from "@/types";
import ImageUpload from "@/components/admin/ImageUpload";

const dayLabels: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export default function AdminConfiguracionPage() {
  const { settings, loading } = useBusinessSettings();
  const [form, setForm] = useState<BusinessSettings>(settings);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Sincronizamos el form con Firestore solo la primera vez que llegan los
  // datos reales (no en cada snapshot posterior), para no pisar lo que la
  // persona está editando si llega una actualización en tiempo real.
  if (!initialized && !loading) {
    setForm(settings);
    setInitialized(true);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      // Filtramos undefined a cualquier profundidad simple antes de escribir
      const clean = JSON.parse(JSON.stringify(form));
      await setDoc(doc(db, "businessSettings", "main"), clean, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError("No pudimos guardar los cambios. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const updateHours = (day: string, field: keyof BusinessHours, value: string | boolean) => {
    setForm({
      ...form,
      hours: {
        ...form.hours,
        [day]: { ...form.hours[day as keyof typeof form.hours], [field]: value },
      },
    });
  };

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6">
        Configuración
      </h1>

      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        <section className="bg-white rounded-2xl border border-coal/10 p-5">
          <h2 className="font-semibold mb-4">Información general</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Nombre del negocio
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Frase corta (tagline)
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Descripción
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Logo
              </label>
              <ImageUpload
                value={form.logo || ""}
                onChange={(logo) => setForm({ ...form, logo })}
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-coal/10 p-5">
          <h2 className="font-semibold mb-4">Contacto y ubicación</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Número de WhatsApp (con código de país, sin espacios ni +)
              </label>
              <input
                type="text"
                value={form.whatsappNumber}
                onChange={(e) =>
                  setForm({ ...form, whatsappNumber: e.target.value })
                }
                placeholder="5491164187474"
                className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Dirección
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Instagram (URL completa)
              </label>
              <input
                type="text"
                value={form.social.instagram}
                onChange={(e) =>
                  setForm({
                    ...form,
                    social: { ...form.social, instagram: e.target.value },
                  })
                }
                className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Facebook (URL completa, opcional)
              </label>
              <input
                type="text"
                value={form.social.facebook}
                onChange={(e) =>
                  setForm({
                    ...form,
                    social: { ...form.social, facebook: e.target.value },
                  })
                }
                className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-coal/10 p-5">
          <h2 className="font-semibold mb-4">Horarios de atención</h2>
          <div className="space-y-2">
            {Object.entries(form.hours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-2 flex-wrap">
                <span className="w-24 text-sm font-medium shrink-0">
                  {dayLabels[day]}
                </span>
                <label className="flex items-center gap-1.5 text-xs shrink-0">
                  <input
                    type="checkbox"
                    checked={!hours.closed}
                    onChange={(e) =>
                      updateHours(day, "closed", !e.target.checked)
                    }
                    className="accent-ember"
                  />
                  Abierto
                </label>
                {!hours.closed && (
                  <>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => updateHours(day, "open", e.target.value)}
                      className="border border-coal/15 rounded-lg px-2 py-1 text-sm"
                    />
                    <span className="text-coal/40 text-sm">a</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => updateHours(day, "close", e.target.value)}
                      className="border border-coal/15 rounded-lg px-2 py-1 text-sm"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-coal/10 p-5">
          <h2 className="font-semibold mb-4">Delivery</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Costo de envío ($)
              </label>
              <input
                type="number"
                min={0}
                value={form.deliveryFee || 0}
                onChange={(e) =>
                  setForm({ ...form, deliveryFee: Number(e.target.value) })
                }
                className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Pedido mínimo ($)
              </label>
              <input
                type="number"
                min={0}
                value={form.minOrderAmount || 0}
                onChange={(e) =>
                  setForm({ ...form, minOrderAmount: Number(e.target.value) })
                }
                className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
              />
            </div>
          </div>
        </section>

        {error && <p className="text-chili text-sm font-medium">{error}</p>}
        {saved && (
          <p className="text-green-700 text-sm font-medium">
            ✓ Cambios guardados. Ya están en vivo en tu sitio.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-ember hover:bg-chili disabled:opacity-60 transition-colors text-cream font-bold px-6 py-3 rounded-xl"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
