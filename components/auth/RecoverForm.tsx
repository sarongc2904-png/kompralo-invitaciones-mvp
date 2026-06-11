"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function RecoverForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch(token ? "/api/auth/reset" : "/api/auth/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        token
          ? { token, password: formData.get("password") }
          : { email: formData.get("email") }
      )
    });

    const data = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setMessage(data?.error || "No se pudo completar la solicitud.");
      return;
    }

    setMessage(token ? "Contraseña actualizada. Ya puedes iniciar sesión." : `Solicitud recibida. Token demo: ${data?.resetUrl ?? "generado"}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg bg-white p-6 shadow-glow luxury-border">
      {token ? (
        <label className="text-sm font-semibold text-ink">
          Nueva contraseña
          <input name="password" type="password" minLength={8} required className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none focus:border-gold" />
        </label>
      ) : (
        <label className="text-sm font-semibold text-ink">
          Correo
          <input name="email" type="email" required className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3 outline-none focus:border-gold" />
        </label>
      )}
      <button disabled={loading} className="rounded-md bg-ink px-5 py-3 text-sm font-bold text-pearl transition hover:bg-emerald disabled:opacity-60">
        {loading ? "Procesando..." : token ? "Actualizar contraseña" : "Enviar recuperación"}
      </button>
      {message ? <p className="text-sm font-semibold text-ink/70">{message}</p> : null}
    </form>
  );
}
