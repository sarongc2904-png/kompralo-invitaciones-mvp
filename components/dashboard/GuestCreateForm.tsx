"use client";

import { useRouter } from "next/navigation";

export function GuestCreateForm({ eventId }: { eventId: string }) {
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, ...Object.fromEntries(formData.entries()) })
    });

    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg bg-white p-5 shadow-glow luxury-border md:grid-cols-5">
      <input name="name" required placeholder="Nombre" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm" />
      <input name="email" type="email" placeholder="Correo" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm" />
      <input name="phone" placeholder="WhatsApp" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm" />
      <input name="seats" type="number" min="1" defaultValue="1" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm" />
      <button className="rounded-md bg-ink px-4 py-3 text-sm font-bold text-pearl hover:bg-emerald">Agregar</button>
    </form>
  );
}
