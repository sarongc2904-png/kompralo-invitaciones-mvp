import Image from "next/image";
import Link from "next/link";
import { Check, Eye, SlidersHorizontal } from "lucide-react";
import type { Template } from "@/types";
import { resolveImageUrl } from "@/lib/media";

const benefits = ["RSVP", "Música", "Ubicación", "Confirmación por WhatsApp", "Código QR"];

export function TemplateCard({ template, variant = "default" }: { template: Template; variant?: "default" | "editorial" }) {
  const isEditorial = variant === "editorial";
  const imageUrl = resolveImageUrl(template.imageUrl);

  return (
    <article className="group overflow-hidden rounded-[1.35rem] bg-white shadow-[0_22px_70px_rgba(17,17,20,0.12)] ring-1 ring-ink/8 transition duration-500 hover:-translate-y-2">
      <div className={`relative overflow-hidden ${isEditorial ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
        <Image
          src={imageUrl}
          alt={`Modelo ${template.name}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/22 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-pearl/40 bg-black/60 px-3 py-1 text-xs font-black text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {template.category}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">Desde $399 MXN</p>
          <h3 className="mt-2 font-display text-3xl leading-none drop-shadow-[0_3px_10px_rgba(0,0,0,0.75)]">{template.name}</h3>
          <p className="mt-2 text-sm font-semibold text-white/90">{template.palette}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-sm font-semibold text-ink/72">
              <Check size={15} className="shrink-0 text-gold" />
              {benefit}
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Link
            href={template.previewUrl}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-black text-pearl shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:bg-emerald"
          >
            <Eye size={16} />
            Ver demo
          </Link>
          <Link
            href={`/crear`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/12 bg-pearl px-4 py-3 text-sm font-black text-ink transition hover:border-gold hover:bg-gold"
          >
            <SlidersHorizontal size={16} />
            Personalizar
          </Link>
        </div>
      </div>
    </article>
  );
}
