"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteButton({ endpoint, label = "Eliminar" }: { endpoint: string; label?: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!window.confirm("¿Eliminar este registro?")) {
      return;
    }

    await fetch(endpoint, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={onDelete} className="inline-flex items-center gap-2 rounded-md border border-rose/30 px-3 py-2 text-sm font-semibold text-rose hover:bg-rose hover:text-white">
      <Trash2 size={15} />
      {label}
    </button>
  );
}
