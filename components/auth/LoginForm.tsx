"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push(searchParams.get("callbackUrl") || "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg bg-white p-6 shadow-glow luxury-border">
      <label className="text-sm font-semibold text-ink">
        Correo
        <input name="email" type="email" required className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none focus:border-gold" />
      </label>
      <label className="text-sm font-semibold text-ink">
        Contraseña
        <input name="password" type="password" required className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none focus:border-gold" />
      </label>
      {error ? <p className="text-sm font-semibold text-rose">{error}</p> : null}
      <button disabled={loading} className="rounded-md bg-ink px-5 py-3 text-sm font-bold text-pearl transition hover:bg-emerald disabled:opacity-60">
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <div className="flex flex-wrap justify-between gap-3 text-sm text-ink/62">
        <Link href="/registro" className="font-semibold text-ink">Crear cuenta</Link>
        <Link href="/recuperar" className="font-semibold text-ink">Recuperar contraseña</Link>
      </div>
    </form>
  );
}
