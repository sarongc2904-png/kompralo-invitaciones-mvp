import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin, type SupabaseInvitation } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminInvitationPage({ params }: PageProps) {
  const session = await requireAdmin();
  const { id } = await params;
  const invitation = await getInvitation(id);

  if (!invitation) {
    notFound();
  }

  const user = await prisma.user
    .findUnique({
      where: { id: invitation.user_id },
      select: { name: true, email: true }
    })
    .catch(() => null);

  return (
    <DashboardShell title="Editar invitacion" description="Corrige datos del comprador y deja la invitacion lista para entregar." role={session.user.role}>
      <div className="mb-5">
        <Link href="/dashboard/admin" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold text-ink transition hover:border-gold hover:text-emerald">
          <ArrowLeft size={15} />
          Volver al administrador
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-4">
          <div className="rounded-[1.5rem] border border-ink/10 bg-white p-6 shadow-glow">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-gold">Cliente</p>
            <h2 className="mt-3 font-display text-3xl text-ink">{user?.name || "Cliente Kompralo"}</h2>
            <p className="mt-2 text-sm text-ink/58">{user?.email || invitation.user_id}</p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald/20 bg-emerald/10 p-6">
            <CheckCircle2 className="text-emerald" size={24} />
            <h3 className="mt-4 font-display text-2xl text-ink">Soporte premium</h3>
            <p className="mt-2 text-sm text-ink/62">
              Si el comprador no entiende el proceso, desde aqui puedes completar datos, mejorar textos y dejar la invitacion lista para revisar o entregar.
            </p>
          </div>
        </aside>

        <form action={saveAdminInvitation} className="rounded-[1.5rem] border border-ink/10 bg-white p-5 shadow-glow">
          <input type="hidden" name="id" value={invitation.id} />

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Diseno o plantilla" name="design_template" defaultValue={invitation.design_template} />
            <Field label="Fecha y hora" name="event_datetime" type="datetime-local" defaultValue={toDatetimeLocal(invitation.event_datetime)} />
            <Field label="Direccion" name="event_location" defaultValue={invitation.event_location} />
            <Field label="WhatsApp" name="whatsapp_number" defaultValue={invitation.whatsapp_number} />
            <Field label="Google Maps" name="map_url" defaultValue={invitation.map_url} />
            <Field label="Mesa de regalos" name="gift_table_url" defaultValue={invitation.gift_table_url} />
            <Field label="Dress code" name="dresscode_text" defaultValue={invitation.dresscode_text} />
            <Field label="Color dress code" name="dresscode_color" defaultValue={invitation.dresscode_color} />
          </div>

          <div className="mt-5 grid gap-5">
            <TextArea label="Galeria de fotos" name="gallery_urls" defaultValue={(invitation.gallery_urls ?? []).join("\n")} helper="Una liga por linea." />
            <TextArea label="Copy personalizado" name="custom_copy" defaultValue={invitation.custom_copy} />
            <TextArea label="Notas de revision" name="revision_notes" defaultValue={invitation.revision_notes} />

            <label className="grid gap-2">
              <span className="text-sm font-black text-ink">Estado</span>
              <select name="status" defaultValue={invitation.status} className="min-h-12 rounded-xl border border-ink/10 bg-pearl px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-gold">
                <option value="draft">Borrador</option>
                <option value="in_review">En revision</option>
                <option value="delivered">Entregada</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Link href="/dashboard/admin" className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink transition hover:border-gold">
              Cancelar
            </Link>
            <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-pearl transition hover:bg-emerald">
              <Save size={16} />
              Guardar cambios del cliente
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

async function getInvitation(id: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("invitations").select("*").eq("id", id).maybeSingle<SupabaseInvitation>();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

async function saveAdminInvitation(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = readField(formData, "id");
  if (!id) {
    redirect("/dashboard/admin");
  }

  const supabase = getSupabaseAdmin();
  const galleryUrls = readField(formData, "gallery_urls")
    .split(/\n|,/)
    .map((url) => url.trim())
    .filter(Boolean);

  await supabase
    .from("invitations")
    .update({
      design_template: nullable(readField(formData, "design_template")),
      event_datetime: normalizeDate(readField(formData, "event_datetime")),
      event_location: nullable(readField(formData, "event_location")),
      whatsapp_number: nullable(readField(formData, "whatsapp_number")),
      gallery_urls: galleryUrls.length ? galleryUrls : null,
      gift_table_url: nullable(readField(formData, "gift_table_url")),
      dresscode_text: nullable(readField(formData, "dresscode_text")),
      dresscode_color: nullable(readField(formData, "dresscode_color")),
      map_url: nullable(readField(formData, "map_url")),
      custom_copy: nullable(readField(formData, "custom_copy")),
      revision_notes: nullable(readField(formData, "revision_notes")),
      status: readStatus(formData),
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  revalidatePath("/dashboard/admin");
  revalidatePath(`/dashboard/admin/invitaciones/${id}`);
  redirect(`/dashboard/admin/invitaciones/${id}`);
}

function Field({
  label,
  name,
  defaultValue,
  type = "text"
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-ink">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ""} className="min-h-12 rounded-xl border border-ink/10 bg-pearl px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-gold" />
    </label>
  );
}

function TextArea({ label, name, defaultValue, helper }: { label: string; name: string; defaultValue?: string | null; helper?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-ink">{label}</span>
      <textarea name={name} defaultValue={defaultValue ?? ""} rows={4} className="rounded-xl border border-ink/10 bg-pearl px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-gold" />
      {helper ? <span className="text-xs font-semibold text-ink/48">{helper}</span> : null}
    </label>
  );
}

function readField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function nullable(value: string) {
  return value.length ? value : null;
}

function normalizeDate(value: string) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function readStatus(formData: FormData): SupabaseInvitation["status"] {
  const status = readField(formData, "status");
  if (status === "in_review" || status === "delivered") return status;
  return "draft";
}

function toDatetimeLocal(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (number: number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
