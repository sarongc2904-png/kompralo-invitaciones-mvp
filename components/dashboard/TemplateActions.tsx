"use client";

import { useRouter } from "next/navigation";
import { DeleteButton } from "./DeleteButton";

export function TemplateActions({ templateId, isActive }: { templateId: string; isActive: boolean }) {
  const router = useRouter();

  async function toggleActive() {
    await fetch(`/api/templates/${templateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive })
    });
    router.refresh();
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <button onClick={toggleActive} className="rounded-md border border-ink/12 px-3 py-2 text-sm font-semibold text-ink">
        {isActive ? "Desactivar" : "Activar"}
      </button>
      <DeleteButton endpoint={`/api/templates/${templateId}`} />
    </div>
  );
}
