import { BusinessSettings } from "@/types";

interface FooterProps {
  business: BusinessSettings;
}

export default function Footer({ business }: FooterProps) {
  return (
    <footer className="bg-coal text-cream/70 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
        <span className="font-display font-bold text-cream">
          {business.name}
        </span>
        <span>
          © {new Date().getFullYear()} {business.name}. Todos los derechos
          reservados.
        </span>
      </div>
    </footer>
  );
}
