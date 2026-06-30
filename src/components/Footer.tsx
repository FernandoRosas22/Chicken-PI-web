import { BusinessSettings } from "@/types";

interface FooterProps {
  business: BusinessSettings;
}

export default function Footer({ business }: FooterProps) {
  return (
    <footer className="bg-coal text-cream/70 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <span className="font-display font-bold text-cream text-lg block mb-2">
            {business.name}
          </span>
          <p className="text-sm text-cream/60">{business.tagline}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a href={"https://wa.me/" + business.whatsappNumber} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cream transition-colors">
            <span>💬</span> Pedir por WhatsApp
          </a>
          <a href={business.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cream transition-colors">
            <span>📷</span> Seguinos en Instagram
          </a>
          <span className="flex items-center gap-2"><span>📍</span> {business.address}</span>
        </div>
        <div className="text-sm">
          <p className="text-cream font-semibold mb-1">Sitio desarrollado por</p>
          <a href="https://www.instagram.com/fer.rosas22" target="_blank" rel="noopener noreferrer" className="text-ember font-bold hover:underline block mb-2">
            Fernando Rosas
          </a>
          <p className="text-cream/50 text-xs">Necesitas una web como esta? Escribime por Instagram.</p>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} {business.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
