"use client";

import { useState } from "react";

export function PublicRsvpForm({ eventId }: { eventId: string }) {
  const [saved, setSaved] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        name: formData.get("name"),
        email: formData.get("email") || null,
        phone: formData.get("phone") || null,
        status: formData.get("status"),
        message: formData.get("message") || null
      })
    });

    setSaved(true);
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg bg-white p-5 shadow-glow luxury-border">
      <p className="font-display text-2xl text-ink">Confirmar asistencia</p>
      <input name="name" required placeholder="Nombre" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm" />
      <input name="email" type="email" placeholder="Correo" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm" />
      <input name="phone" placeholder="WhatsApp" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm" />
      <select name="status" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm">
        <option value="CONFIRMED">Confirmaré asistencia</option>
        <option value="DECLINED">No podré asistir</option>
      </select>
      <textarea name="message" rows={3} placeholder="Mensaje opcional" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm" />
      <button className="rounded-md bg-ink px-4 py-3 text-sm font-bold text-pearl hover:bg-emerald">Enviar RSVP</button>
      {saved ? <p className="text-sm font-semibold text-emerald">Respuesta guardada.</p> : null}
    </form>
  );
}
