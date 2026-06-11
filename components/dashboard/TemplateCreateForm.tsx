"use client";

import { useRouter } from "next/navigation";
import { categories } from "@/lib/categories";

export function TemplateCreateForm() {
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...Object.fromEntries(formData.entries()),
        isActive: true
      })
    });

    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg bg-white p-5 shadow-glow luxury-border md:grid-cols-2">
      <input name="name" required placeholder="Nombre" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm" />
      <select name="category" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm">
        {categories.map((category) => <option key={category}>{category}</option>)}
      </select>
      <input name="imageUrl" required placeholder="URL de imagen" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm" />
      <input name="previewUrl" placeholder="URL de preview" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm" />
      <textarea name="description" rows={3} placeholder="Descripción" className="rounded-md border border-ink/12 bg-pearl px-4 py-3 text-sm md:col-span-2" />
      <button className="rounded-md bg-ink px-4 py-3 text-sm font-bold text-pearl hover:bg-emerald md:col-span-2">Crear plantilla</button>
    </form>
  );
}
