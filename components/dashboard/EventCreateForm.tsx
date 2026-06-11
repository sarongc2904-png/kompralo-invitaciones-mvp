"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/categories";

export function EventCreateForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    if (!response.ok) {
      setError("No se pudo crear el evento.");
      return;
    }

    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg bg-white p-5 shadow-glow luxury-border md:grid-cols-2">
      <Input name="title" label="Título" required />
      <label className="text-sm font-semibold text-ink">
        Tipo
        <select name="type" className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3">
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </label>
      <Input name="honoree" label="Festejado" required />
      <Input name="eventDate" label="Fecha" type="date" required />
      <Input name="eventTime" label="Hora" type="time" required />
      <Input name="venue" label="Lugar" />
      <Input name="address" label="Dirección" required />
      <Input name="mapsUrl" label="Google Maps" />
      <Input name="dressCode" label="Dress code" />
      <Input name="giftTable" label="Mesa de regalos" />
      <Input name="heroImage" label="Imagen principal URL" />
      <label className="text-sm font-semibold text-ink">
        Estado
        <select name="status" className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3">
          <option value="DRAFT">Borrador</option>
          <option value="PUBLISHED">Publicado</option>
        </select>
      </label>
      <label className="md:col-span-2 text-sm font-semibold text-ink">
        Notas
        <textarea name="notes" rows={4} className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3" />
      </label>
      {error ? <p className="md:col-span-2 text-sm font-semibold text-rose">{error}</p> : null}
      <button className="md:col-span-2 rounded-md bg-ink px-5 py-3 text-sm font-bold text-pearl hover:bg-emerald">
        Crear evento
      </button>
    </form>
  );
}

function Input({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="text-sm font-semibold text-ink">
      {label}
      <input name={name} type={type} required={required} className="mt-2 w-full rounded-md border border-ink/12 bg-pearl px-4 py-3" />
    </label>
  );
}
