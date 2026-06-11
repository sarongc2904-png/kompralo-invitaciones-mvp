import Image from "next/image";
import Link from "next/link";
import { Eye, MousePointer2 } from "lucide-react";
import type { Template } from "@/types";

export function TemplateCard({ template, variant = "default" }: { template: Template; variant?: "default" | "editorial" }) {
  const isEditorial = variant === "editorial";

  return (
    <article className={`group relative overflow-hidden rounded-[1.35rem] bg-white shadow-[0_22px_70px_rgba(17,17,20,0.12)] transition duration-500 hover:-translate-y-2 ${isEditorial ? "min-h-[520px]" : ""}`}>
      <div className={`relative overflow-hidden ${isEditorial ? "h-full min-h-[520px]" : "aspect-[4/5]"}`}>
        <Image
          src={template.imageUrl}
          alt={`Modelo ${template.name}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/48 to-black/12" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/82 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-pearl/35 bg-black/55 px-3 py-1 text-xs font-black text-pearl shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {template.category}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5 text-pearl drop-shadow-[0_3px_12px_rgba(0,0,0,0.88)]">
          <h3 className="font-display text-3xl leading-none text-white">{template.name}</h3>
          <p className="mt-2 text-base font-semibold text-white/92">{template.palette}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link
              href={template.previewUrl}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-pearl/50 bg-black/55 px-3 py-2 text-sm font-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:border-gold hover:bg-ink hover:text-gold"
            >
              <Eye size={16} />
              Vista
            </Link>
            <Link
              href={`/formulario?modelo=${template.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-3 py-2 text-sm font-black text-ink shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition hover:bg-pearl"
            >
              <MousePointer2 size={16} />
              Elegir
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
