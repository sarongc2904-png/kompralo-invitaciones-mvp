import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  IconBrandWhatsapp,
  IconCalendarEvent,
  IconCheck,
  IconGift,
  IconHeadset,
  IconMapPin,
  IconPalette,
  IconPhoto,
  IconPhotoScan,
  IconPencil,
  IconQrcode,
  IconShirt,
  IconSparkles,
  IconTruckDelivery
} from "@tabler/icons-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { plans } from "@/data/plans";
import { requireUser } from "@/lib/auth-guards";
import { getSupabaseAdmin, type SupabaseInvitation, type SupabaseOrder } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const sectionLabels: Record<string, { title: string; description: string; icon: React.ElementType }> = {
  design: { title: "Diseno", description: "Modelo base o estilo visual que quieres usar.", icon: IconPalette },
  datetime: { title: "Fecha, hora y lugar", description: "Datos principales del evento.", icon: IconCalendarEvent },
  rsvp: { title: "RSVP", description: "Confirmaciones de asistencia para tus invitados.", icon: IconCheck },
  whatsapp: { title: "WhatsApp", description: "Numero que recibira mensajes y confirmaciones.", icon: IconBrandWhatsapp },
  delivery: { title: "Entrega", description: "Envia tu invitacion a revision cuando este lista.", icon: IconTruckDelivery },
  gallery: { title: "Galeria", description: "Fotos para la experiencia visual de la invitacion.", icon: IconPhoto },
  qr: { title: "Codigo QR", description: "Acceso rapido para compartir tu invitacion.", icon: IconQrcode },
  gift_table: { title: "Mesa de regalos", description: "Liga de regalos o mesa de obsequios.", icon: IconGift },
  dresscode: { title: "Dress code", description: "Indicaciones de vestimenta y color.", icon: IconShirt },
  map: { title: "Google Maps", description: "Liga de ubicacion exacta del evento.", icon: IconMapPin },
  custom_copy: { title: "Copy personalizado", description: "Texto emocional, tono y frase principal.", icon: IconPencil },
  visual_style: { title: "Estilo visual", description: "Direccion creativa para colores, mood y acabados.", icon: IconSparkles },
  photo_optimize: { title: "Optimizacion de fotos", description: "Solicita ajuste premium de tus imagenes.", icon: IconPhotoScan },
  revisions: { title: "Revisiones", description: "Notas y cambios solicitados al equipo.", icon: IconPencil },
  support: { title: "Soporte", description: "Acompanamiento directo para cerrar detalles.", icon: IconHeadset }
};

async function saveInvitationSection(formData: FormData) {
  "use server";

  const session = await requireUser();
  const invitationId = String(formData.get("invitation_id") ?? "");
  const section = String(formData.get("section") ?? "");

  if (!invitationId || !section) {
    return;
  }

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  };

  if (section === "design") {
    update.design_template = String(formData.get("design_template") ?? "").trim() || null;
  }

  if (section === "datetime") {
    const datetime = String(formData.get("event_datetime") ?? "");
    update.event_datetime = datetime ? new Date(datetime).toISOString() : null;
    update.event_location = String(formData.get("event_location") ?? "").trim() || null;
  }

  if (section === "rsvp") {
    update.rsvp_enabled = formData.has("rsvp_enabled");
  }

  if (section === "whatsapp") {
    update.whatsapp_number = String(formData.get("whatsapp_number") ?? "").trim() || null;
  }

  if (section === "delivery") {
    update.status = "in_review";
  }

  if (section === "gallery") {
    update.gallery_urls = String(formData.get("gallery_urls") ?? "")
      .split(/\r?\n|,/)
      .map((url) => url.trim())
      .filter(Boolean);
  }

  if (section === "qr") {
    update.visual_style = { qr_enabled: true };
  }

  if (section === "gift_table") {
    update.gift_table_url = String(formData.get("gift_table_url") ?? "").trim() || null;
  }

  if (section === "dresscode") {
    update.dresscode_text = String(formData.get("dresscode_text") ?? "").trim() || null;
    update.dresscode_color = String(formData.get("dresscode_color") ?? "").trim() || null;
  }

  if (section === "map") {
    update.map_url = String(formData.get("map_url") ?? "").trim() || null;
  }

  if (section === "custom_copy") {
    update.custom_copy = String(formData.get("custom_copy") ?? "").trim() || null;
  }

  if (section === "visual_style") {
    const value = String(formData.get("visual_style") ?? "").trim();
    try {
      update.visual_style = value ? JSON.parse(value) : {};
    } catch {
      update.visual_style = { notas: value };
    }
  }

  if (section === "photo_optimize") {
    update.visual_style = { photo_optimize_requested: true };
  }

  if (section === "revisions") {
    update.revision_notes = String(formData.get("revision_notes") ?? "").trim() || null;
  }

  if (section === "support") {
    update.visual_style = { support_requested: true };
  }

  await getSupabaseAdmin().from("invitations").update(update).eq("id", invitationId).eq("user_id", session.user.id);
  revalidatePath("/dashboard");
}

export default async function DashboardPage() {
  const session = await requireUser();

  if (session.user.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase
    .from("orders")
    .select("id,user_id,plan_slug,stripe_session_id,paid_at")
    .eq("user_id", session.user.id)
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle<SupabaseOrder>();

  if (!order) {
    return (
      <DashboardShell title="Tu invitacion" description="Cuando completes tu compra, aqui aparecera tu editor." role="Cliente">
        <div className="rounded-[1.35rem] border border-black/10 bg-white p-7 shadow-[0_18px_65px_rgba(17,17,20,0.08)]">
          <h2 className="font-display text-4xl text-ink">Aun no tienes una invitacion comprada</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
            Elige un plan, paga con Stripe y desbloquearemos tu editor con las secciones incluidas.
          </p>
          <Link href="/precios" className="mt-6 inline-flex rounded-full bg-ink px-6 py-4 text-sm font-black text-white">
            Ver planes
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const { data: invitation } = await supabase
    .from("invitations")
    .select("*")
    .eq("order_id", order.id)
    .eq("user_id", session.user.id)
    .maybeSingle<SupabaseInvitation>();

  const plan = plans.find((item) => item.id === order.plan_slug) ?? plans[0];
  const sections = plan.sections ?? [];

  return (
    <DashboardShell title="Editor de tu invitacion" description={`Plan ${plan.name}. Solo ves las secciones incluidas en tu compra.`} role="Cliente">
      <div className="mb-6 rounded-[1.35rem] border border-blue-500/20 bg-blue-50 p-5 text-sm font-semibold text-blue-950">
        Pago confirmado. Tu invitacion esta en estado <span className="font-black">{invitation?.status ?? "draft"}</span>.
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((section) => (
          <EditorCard key={section} section={section} invitation={invitation} />
        ))}
      </div>
    </DashboardShell>
  );
}

function EditorCard({ section, invitation }: { section: string; invitation: SupabaseInvitation | null }) {
  const meta = sectionLabels[section];
  const Icon = meta.icon;

  return (
    <form action={saveInvitationSection} className="rounded-[1.25rem] border border-black/10 bg-white p-6 shadow-[0_16px_50px_rgba(17,17,20,0.07)]">
      <input type="hidden" name="invitation_id" value={invitation?.id ?? ""} />
      <input type="hidden" name="section" value={section} />
      <div className="flex items-start gap-4">
        <span className="grid size-11 place-items-center rounded-2xl bg-[#f4ead4] text-[#b8892f]">
          <Icon size={22} />
        </span>
        <div>
          <h2 className="font-display text-3xl leading-none text-ink">{meta.title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink/62">{meta.description}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4">{renderFields(section, invitation)}</div>
      <button type="submit" className="mt-6 inline-flex w-full justify-center rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-emerald">
        Guardar {meta.title}
      </button>
    </form>
  );
}

function renderFields(section: string, invitation: SupabaseInvitation | null) {
  if (section === "design") {
    return <Input label="Plantilla o estilo" name="design_template" defaultValue={invitation?.design_template ?? ""} placeholder="Baby Shower Deluxe, Elegancia Dorada..." />;
  }

  if (section === "datetime") {
    return (
      <>
        <Input label="Fecha y hora" name="event_datetime" type="datetime-local" defaultValue={formatDateTimeLocal(invitation?.event_datetime)} />
        <Textarea label="Lugar del evento" name="event_location" defaultValue={invitation?.event_location ?? ""} placeholder="Salon, hacienda, ciudad..." />
      </>
    );
  }

  if (section === "rsvp") {
    return (
      <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-4 text-sm font-black">
        <input type="checkbox" name="rsvp_enabled" defaultChecked={invitation?.rsvp_enabled ?? true} className="size-5 accent-[#1f513f]" />
        Activar confirmacion RSVP
      </label>
    );
  }

  if (section === "whatsapp") {
    return <Input label="WhatsApp" name="whatsapp_number" defaultValue={invitation?.whatsapp_number ?? ""} placeholder="Ej. 8112345678" />;
  }

  if (section === "delivery") {
    return <p className="rounded-2xl bg-[#f7f3eb] p-4 text-sm leading-6 text-ink/70">Cuando termines de editar, guarda esta seccion para mandar tu invitacion a revision.</p>;
  }

  if (section === "gallery") {
    return <Textarea label="URLs de galeria" name="gallery_urls" defaultValue={(invitation?.gallery_urls ?? []).join("\n")} placeholder="Pega una URL por linea" />;
  }

  if (section === "qr") {
    return <p className="rounded-2xl bg-[#f7f3eb] p-4 text-sm leading-6 text-ink/70">El codigo QR se genera con la liga publica final de tu invitacion.</p>;
  }

  if (section === "gift_table") {
    return <Input label="URL de mesa de regalos" name="gift_table_url" defaultValue={invitation?.gift_table_url ?? ""} placeholder="https://..." />;
  }

  if (section === "dresscode") {
    return (
      <>
        <Input label="Texto de dress code" name="dresscode_text" defaultValue={invitation?.dresscode_text ?? ""} placeholder="Formal, blanco, cocktail..." />
        <Input label="Color sugerido" name="dresscode_color" defaultValue={invitation?.dresscode_color ?? ""} placeholder="Dorado, rosa, azul..." />
      </>
    );
  }

  if (section === "map") {
    return <Input label="URL de Google Maps" name="map_url" defaultValue={invitation?.map_url ?? ""} placeholder="https://maps.google.com/..." />;
  }

  if (section === "custom_copy") {
    return <Textarea label="Copy personalizado" name="custom_copy" defaultValue={invitation?.custom_copy ?? ""} placeholder="Texto principal, frase, tono emocional..." />;
  }

  if (section === "visual_style") {
    return (
      <Textarea
        label="Direccion visual"
        name="visual_style"
        defaultValue={JSON.stringify(invitation?.visual_style ?? {}, null, 2)}
        placeholder='{"colores":"rosa, champagne", "mood":"deluxe"}'
      />
    );
  }

  if (section === "photo_optimize") {
    return <p className="rounded-2xl bg-[#f7f3eb] p-4 text-sm leading-6 text-ink/70">Guardaremos esta solicitud para optimizar tus fotos antes de entregar la invitacion.</p>;
  }

  if (section === "revisions") {
    return <Textarea label="Notas de revision" name="revision_notes" defaultValue={invitation?.revision_notes ?? ""} placeholder="Cambios, correcciones o ajustes que necesitas..." />;
  }

  return <p className="rounded-2xl bg-[#f7f3eb] p-4 text-sm leading-6 text-ink/70">Tu soporte queda marcado para seguimiento por WhatsApp.</p>;
}

function Input({ label, name, defaultValue, placeholder, type = "text" }: { label: string; name: string; defaultValue?: string; placeholder?: string; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-ink">
      {label}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#d2ae5f]"
      />
    </label>
  );
}

function Textarea({ label, name, defaultValue, placeholder }: { label: string; name: string; defaultValue?: string; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-ink">
      {label}
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={4}
        className="rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#d2ae5f]"
      />
    </label>
  );
}

function formatDateTimeLocal(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
}
