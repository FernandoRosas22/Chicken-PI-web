"use client";

import { useState, useRef } from "react";
import { fileToCompressedBase64 } from "@/lib/imageUpload";

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");
    setLoading(true);
    try {
      const base64 = await fileToCompressedBase64(file);
      onChange(base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar la imagen.");
    } finally {
      setLoading(false);
    }
  };

  const isPlaceholder = !value || value.startsWith("/placeholder");

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-full h-40 rounded-xl border-2 border-dashed border-coal/20 bg-cream-dark flex items-center justify-center cursor-pointer overflow-hidden hover:border-ember transition-colors"
      >
        {loading ? (
          <span className="text-coal/50 text-sm">Procesando imagen...</span>
        ) : isPlaceholder ? (
          <span className="text-coal/40 text-sm text-center px-4">
            Tocá para subir una foto
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Vista previa" className="w-full h-full object-cover" />
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="text-chili text-xs mt-1.5">{error}</p>}
      {!isPlaceholder && !loading && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-coal/50 hover:text-chili underline mt-1.5"
        >
          Quitar foto
        </button>
      )}
    </div>
  );
}
