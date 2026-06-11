"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit3, Save, X } from "lucide-react";
import { DeleteButton } from "./DeleteButton";
import { categories } from "@/lib/categories";
import { resolveImageUrl } from "@/lib/media";

type TemplateActionsProps = {
  template: {
    id: string;
    name: string;
    category: string;
    description: string | null;
    imageUrl: string;
    previewUrl: string | null;
    isActive: boolean;
  };
};

export function TemplateActions({ template }: TemplateActionsProps) {
  const router = useRouter();
  const imageUrl = resolveImageUrl(template.imageUrl);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function toggleActive() {
    await fetch(`/api/templates/${template.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !template.isActive })
    });
    router.refresh();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/templates/${template.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        category: formData.get("category"),
        description: formData.get("description"),
        imageUrl: formData.get("imageUrl"),
        previewUrl: formData.get("previewUrl"),
        isActive: formData.get("isActive") === "on"
      })
    });

    setSaving(false);

    if (!response.ok) {
      setError("No se pudo guardar la plantilla.");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setEditing((value) => !value)} className="inline-flex items-center gap-2 rounded-md border border-ink/12 px-3 py-2 text-sm font-semibold text-ink">
          {editing ? <X size={15} /> : <Edit3 size={15} />}
          {editing ? "Cerrar" : "Editar"}
        </button>
        <button onClick={toggleActive} className="rounded-md border border-ink/12 px-3 py-2 text-sm font-semibold text-ink">
          {template.isActive ? "Desactivar" : "Activar"}
        </button>
        <DeleteButton endpoint={`/api/templates/${template.id}`} />
      </div>

      {editing ? (
        <form onSubmit={onSubmit} className="mt-5 grid gap-3 rounded-2xl border border-gold/25 bg-pearl p-4">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-white">
            <Image src={imageUrl} alt={template.name} fill sizes="420px" className="object-cover" />
          </div>
          <Input name="name" label="Nombre" defaultValue={template.name} required />
          <label className="text-sm font-semibold text-ink">
            Categoría
            <select name="category" defaultValue={template.category} className="mt-2 w-full rounded-md border border-ink/12 bg-white px-4 py-3">
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <Input name="imageUrl" label="URL de imagen" defaultValue={template.imageUrl} required />
          <p className="-mt-2 text-xs leading-5 text-ink/55">
            Puedes escribir solo el nombre del archivo, por ejemplo: boda-black-gold. También acepta /templates/boda-black-gold.jpg.
          </p>
          <Input name="previewUrl" label="URL de vista previa" defaultValue={template.previewUrl ?? ""} />
          <label className="text-sm font-semibold text-ink">
            Descripción / paleta
            <textarea name="description" defaultValue={template.description ?? ""} rows={3} className="mt-2 w-full rounded-md border border-ink/12 bg-white px-4 py-3" />
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <input name="isActive" type="checkbox" defaultChecked={template.isActive} />
            Plantilla activa
          </label>
          {error ? <p className="text-sm font-semibold text-rose">{error}</p> : null}
          <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-bold text-pearl hover:bg-emerald disabled:opacity-60">
            <Save size={16} />
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      ) : null}
    </div>
  );
}

function Input({ name, label, defaultValue, required = false }: { name: string; label: string; defaultValue: string; required?: boolean }) {
  return (
    <label className="text-sm font-semibold text-ink">
      {label}
      <input name={name} defaultValue={defaultValue} required={required} className="mt-2 w-full rounded-md border border-ink/12 bg-white px-4 py-3" />
    </label>
  );
}
