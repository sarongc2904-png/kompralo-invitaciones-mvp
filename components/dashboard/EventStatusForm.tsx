"use client";

import { useRouter } from "next/navigation";

export function EventStatusForm({ eventId, status }: { eventId: string; status: string }) {
  const router = useRouter();

  async function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    await fetch(`/api/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: event.target.value })
    });
    router.refresh();
  }

  return (
    <select defaultValue={status} onChange={onChange} className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm font-semibold text-ink">
      <option value="DRAFT">Borrador</option>
      <option value="PUBLISHED">Publicado</option>
      <option value="ARCHIVED">Archivado</option>
    </select>
  );
}
