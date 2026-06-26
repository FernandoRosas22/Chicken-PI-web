"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch {
      setError("Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError("Ingresá tu email primero para enviarte el link de recuperación.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError("");
    } catch {
      setError("No pudimos enviar el email. Revisá que sea correcto.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-coal px-4">
      <div className="w-full max-w-sm bg-cream rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-black text-chili mb-1">
            Chicken<span className="text-ember"> PI</span>
          </h1>
          <p className="text-coal/60 text-sm">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-coal/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-ember"
            />
          </div>

          {error && (
            <p className="text-chili text-sm font-medium">{error}</p>
          )}
          {resetSent && (
            <p className="text-green-700 text-sm font-medium">
              Te enviamos un email para recuperar tu contraseña.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ember hover:bg-chili disabled:opacity-60 transition-colors text-cream font-bold py-3 rounded-xl"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full text-center text-sm text-coal/60 hover:text-ember underline"
          >
            Olvidé mi contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
