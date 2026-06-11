import Image from "next/image";
import Link from "next/link";
import { Eye, MousePointer2 } from "lucide-react";
import type { Template } from "@/types";

export function TemplateCard({ template }: { template: Template }) {
  return (
    <article className="group overflow-hidden rounded-lg bg-white shadow-[0_18px_50px_rgba(17,17,20,0.10)] luxury-border">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={template.imageUrl}
          alt={`Modelo ${template.name}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/72 via-ink/6 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-pearl/92 px-3 py-1 text-xs font-semibold text-ink">
          {template.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-2xl text-ink">{template.name}</h3>
        <p className="mt-1 text-sm text-ink/60">{template.palette}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            href={template.previewUrl}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-ink/12 px-3 py-2 text-sm font-semibold text-ink transition hover:border-gold hover:text-gold"
          >
            <Eye size={16} />
            Vista
          </Link>
          <Link
            href={`/formulario?modelo=${template.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-pearl transition hover:bg-emerald"
          >
            <MousePointer2 size={16} />
            Seleccionar
          </Link>
        </div>
      </div>
    </article>
  );
}
