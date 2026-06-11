"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
      })
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "No se pudo crear la cuenta.");
      return;
    }

    router.push("/login");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg bg-white p-6 shadow-glow luxury-border">
      <label className="text-sm font-semibold text-ink">
        Nombre
        <input name="name" required className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none focus:border-gold" />
      </label>
      <label className="text-sm font-semibold text-ink">
        Correo
        <input name="email" type="email" required className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none focus:border-gold" />
      </label>
      <label className="text-sm font-semibold text-ink">
        Contraseña
        <input name="password" type="password" minLength={8} required className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none focus:border-gold" />
      </label>
      {error ? <p className="text-sm font-semibold text-rose">{error}</p> : null}
      <button disabled={loading} className="rounded-md bg-ink px-5 py-3 text-sm font-bold text-pearl transition hover:bg-emerald disabled:opacity-60">
        {loading ? "Creando..." : "Crear cuenta"}
      </button>
      <Link href="/login" className="text-sm font-semibold text-ink">Ya tengo cuenta</Link>
    </form>
  );
}
