import Image from "next/image";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TemplateCreateForm } from "@/components/dashboard/TemplateCreateForm";
import { TemplateActions } from "@/components/dashboard/TemplateActions";
import { requireAdmin } from "@/lib/auth-guards";
import { resolveImageUrl } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {
  const session = await requireAdmin();
  const templates = await prisma.template.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);

  return (
    <DashboardShell title="Plantillas" description="Edita nombres, categoría, imagen, vista previa y estado de cada modelo." role={session.user.role}>
      <TemplateCreateForm />
      <div className="mt-8 grid gap-5 xl:grid-cols-3 md:grid-cols-2">
        {templates.map((template) => (
          <article key={template.id} className="overflow-hidden rounded-[1.35rem] bg-white shadow-[0_18px_65px_rgba(17,17,20,0.08)] ring-1 ring-ink/8">
            <div className="relative aspect-[16/10] bg-pearl">
              <Image src={resolveImageUrl(template.imageUrl)} alt={template.name} fill sizes="(min-width: 1280px) 33vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-pearl/90 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-ink">
                {template.category}
              </span>
            </div>
            <div className="p-5">
              <h2 className="font-display text-3xl text-ink">{template.name}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/62">{template.description}</p>
              <p className={`mt-4 text-xs font-black uppercase tracking-[0.18em] ${template.isActive ? "text-emerald" : "text-rose"}`}>
                {template.isActive ? "Activa" : "Inactiva"}
              </p>
              <TemplateActions template={template} />
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
