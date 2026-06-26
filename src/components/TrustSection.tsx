"use client";

import { BusinessSettings } from "@/types";

interface TrustSectionProps {
  business: BusinessSettings;
}

const dayLabels: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export default function TrustSection({ business }: TrustSectionProps) {
  return (
    <section id="ubicacion" className="bg-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <span className="text-2xl">📍</span> Ubicación
          </h3>
          <p className="text-coal/70">{business.address}</p>
        </div>

        <div>
          <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <span className="text-2xl">🕒</span> Horarios
          </h3>
          <ul className="text-coal/70 text-sm space-y-1">
            {Object.entries(business.hours).map(([day, hours]) => (
              <li key={day} className="flex justify-between gap-4">
                <span>{dayLabels[day]}</span>
                <span className="font-medium">
                  {hours.closed ? "Cerrado" : `${hours.open} - ${hours.close}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <span className="text-2xl">💬</span> Contacto
          </h3>
          <a
            href={`https://wa.me/${business.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ember font-semibold hover:underline block mb-2"
          >
            Pedir por WhatsApp
          </a>
          {business.social.instagram && (
            <a
              href={business.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-coal/70 hover:text-ember block"
            >
              Instagram @chickenpi2025
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
