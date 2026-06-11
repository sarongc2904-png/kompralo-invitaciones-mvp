import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TemplateCreateForm } from "@/components/dashboard/TemplateCreateForm";
import { TemplateActions } from "@/components/dashboard/TemplateActions";
import { requireAdmin } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {
  const session = await requireAdmin();
  const templates = await prisma.template.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);

  return (
    <DashboardShell title="Plantillas" description="CRUD administrativo de plantillas." role={session.user.role}>
      <TemplateCreateForm />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {templates.map((template) => (
          <article key={template.id} className="rounded-lg bg-white p-5 shadow-glow luxury-border">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{template.category}</p>
            <h2 className="mt-2 font-display text-2xl text-ink">{template.name}</h2>
            <p className="mt-2 text-sm text-ink/62">{template.description}</p>
            <p className="mt-4 text-xs font-semibold text-ink/50">{template.isActive ? "Activa" : "Inactiva"}</p>
            <TemplateActions templateId={template.id} isActive={template.isActive} />
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
