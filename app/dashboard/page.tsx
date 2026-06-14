import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  IconArrowRight,
  IconBrandWhatsapp,
  IconCalendarEvent,
  IconCheck,
  IconCircleCheck,
  IconClock,
  IconEye,
  IconGift,
  IconHeadset,
  IconLink,
  IconMapPin,
  IconPalette,
  IconPhoto,
  IconPhotoScan,
  IconPencil,
  IconQrcode,
  IconShare3,
  IconShirt,
  IconSend2,
  IconSparkles,
  IconTruckDelivery
} from "@tabler/icons-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { plans } from "@/data/plans";
import { requireUser } from "@/lib/auth-guards";
import { getSupabaseAdmin, type SupabaseInvitation, type SupabaseOrder } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const sectionLabels: Record<string, { title: string; description: string; icon: React.ElementType }> = {
  design: { title: "Diseño", description: "Modelo base o estilo visual que quieres usar.", icon: IconPalette },
  datetime: { title: "Fecha, hora y lugar", description: "Datos principales del evento.", icon: IconCalendarEvent },
  rsvp: { title: "RSVP", description: "Confirmaciones de asistencia para tus invitados.", icon: IconCheck },
  whatsapp: { title: "WhatsApp", description: "Número que recibirá mensajes y confirmaciones.", icon: IconBrandWhatsapp },
  delivery: { title: "Revisión final", description: "Cuando todo esté listo, manda tu invitación al equipo.", icon: IconTruckDelivery },
  gallery: { title: "Galería", description: "Fotos para la experiencia visual de la invitación.", icon: IconPhoto },
  qr: { title: "Código QR", description: "Acceso rápido para compartir tu invitación.", icon: IconQrcode },
  gift_table: { title: "Mesa de regalos", description: "Liga de regalos o mesa de obsequios.", icon: IconGift },
  dresscode: { title: "Dress code", description: "Indicaciones de vestimenta y color.", icon: IconShirt },
  map: { title: "Google Maps", description: "Liga de ubicación exacta del evento.", icon: IconMapPin },
  custom_copy: { title: "Copy personalizado", description: "Texto emocional, tono y frase principal.", icon: IconPencil },
  visual_style: { title: "Estilo visual", description: "Dirección creativa para colores, mood y acabados.", icon: IconSparkles },
  photo_optimize: { title: "Optimización de fotos", description: "Solicita ajuste premium de tus imágenes.", icon: IconPhotoScan },
  revisions: { title: "Notas de cambios", description: "Cambios que quieres que revise el equipo.", icon: IconPencil },
  support: { title: "Soporte", description: "Acompañamiento directo para cerrar detalles.", icon: IconHeadset }
};

const statusCopy = {
  draft: {
    label: "Editando",
    description: "Completa tus datos, guarda cada sección y revisa la previsualización.",
    icon: IconPencil
  },
  in_review: {
    label: "En revisión",
    description: "Tu invitación ya fue enviada. Nuestro equipo revisará los detalles antes de entregarla.",
    icon: IconClock
  },
  delivered: {
    label: "Lista para compartir",
    description: "Tu invitación ya está lista para compartir con tus invitados.",
    icon: IconCircleCheck
  }
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
    update.visual_style = { ...(await readVisualStyle(invitationId, session.user.id)), qr_enabled: true };
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
    update.visual_style = { ...(await readVisualStyle(invitationId, session.user.id)), photo_optimize_requested: true };
  }

  if (section === "revisions") {
    update.revision_notes = String(formData.get("revision_notes") ?? "").trim() || null;
  }

  if (section === "support") {
    update.visual_style = { ...(await readVisualStyle(invitationId, session.user.id)), support_requested: true };
  }

  await getSupabaseAdmin().from("invitations").update(update).eq("id", invitationId).eq("user_id", session.user.id);
  revalidatePath("/dashboard");
}

async function readVisualStyle(invitationId: string, userId: string) {
  const { data } = await getSupabaseAdmin()
    .from("invitations")
    .select("visual_style")
    .eq("id", invitationId)
    .eq("user_id", userId)
    .maybeSingle<Pick<SupabaseInvitation, "visual_style">>();

  return data?.visual_style ?? {};
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
      <DashboardShell title="Tu invitación" description="Cuando completes tu compra, aquí aparecerá tu editor." role="Cliente">
        <div className="rounded-[1.35rem] border border-black/10 bg-white p-7 shadow-[0_18px_65px_rgba(17,17,20,0.08)]">
          <h2 className="font-display text-4xl text-ink">Aún no tienes una invitación comprada</h2>
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
    <DashboardShell title="Tu invitación" description={`Plan ${plan.name}. Aquí solo ves y editas la invitación que compraste.`} role="Cliente">
      <CustomerProgress invitation={invitation} planName={plan.name} />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div id="previsualizar" className="scroll-mt-28">
          <InvitationPreviewCard invitation={invitation} planName={plan.name} />
          <ShareStatusCard invitation={invitation} />
        </div>

        <div id="editar" className="scroll-mt-28">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b8892f]">Editar datos</p>
              <h2 className="mt-2 font-display text-4xl leading-none text-ink">Completa tu invitación por secciones</h2>
            </div>
            <a href="#previsualizar" className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-3 text-sm font-black text-ink transition hover:border-gold hover:text-emerald">
              Ver vista previa
              <IconEye size={17} />
            </a>
          </div>
          <div className="grid gap-5">
            {sections.map((section) => (
              <EditorCard key={section} section={section} invitation={invitation} />
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function CustomerProgress({ invitation, planName }: { invitation: SupabaseInvitation | null; planName: string }) {
  const status = invitation?.status ?? "draft";
  const meta = statusCopy[status];
  const StatusIcon = meta.icon;

  return (
    <div className="mb-7 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[1.35rem] border border-black/10 bg-white p-6 shadow-[0_18px_65px_rgba(17,17,20,0.08)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b8892f]">Compra confirmada</p>
            <h2 className="mt-3 font-display text-4xl leading-none text-ink">Tu ruta para dejarla lista</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/64">
              Sigue estos cuatro pasos. Primero editas, después revisas cómo se verá, la mandas a revisión y al final compartes el enlace con tus invitados.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald/20 bg-emerald/10 px-4 py-3 text-sm font-black text-emerald">
            Plan {planName}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <FlowStep number="01" icon={IconPencil} title="Edita" text="Llena tus datos y guarda cada sección." active />
          <FlowStep number="02" icon={IconEye} title="Previsualiza" text="Revisa el resultado antes de enviarla." active={Boolean(invitation)} />
          <FlowStep number="03" icon={IconSend2} title="Revisión" text="Mándala al equipo para ajustes finales." active={status === "in_review" || status === "delivered"} />
          <FlowStep number="04" icon={IconShare3} title="Comparte" text="Usa tu liga final cuando esté entregada." active={status === "delivered"} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="#editar" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-emerald">
            Empezar a editar
            <IconArrowRight size={17} />
          </a>
          <a href="#previsualizar" className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-black text-ink transition hover:border-gold hover:text-emerald">
            Ver previsualización
            <IconEye size={17} />
          </a>
        </div>
      </section>

      <aside className="rounded-[1.35rem] border border-[#d2ae5f]/35 bg-[#111114] p-6 text-white shadow-[0_22px_70px_rgba(17,17,20,0.14)]">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#d2ae5f]">
            <StatusIcon size={24} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d2ae5f]">Estado actual</p>
            <h3 className="mt-2 font-display text-4xl leading-none">{meta.label}</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/68">{meta.description}</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-white/72">
          Siguiente paso: {getNextStep(status)}
        </div>
      </aside>
    </div>
  );
}

function FlowStep({ number, icon: Icon, title, text, active }: { number: string; icon: React.ElementType; title: string; text: string; active: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 transition ${active ? "border-[#d2ae5f]/45 bg-[#fbfaf7]" : "border-black/8 bg-white opacity-55"}`}>
      <div className="flex items-center justify-between gap-3">
        <span className={`text-xs font-black tracking-[0.22em] ${active ? "text-[#b8892f]" : "text-ink/35"}`}>{number}</span>
        <span className={`grid size-10 place-items-center rounded-full ${active ? "bg-[#f4ead4] text-[#b8892f]" : "bg-ink/5 text-ink/35"}`}>
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-4 text-sm font-black text-ink">{title}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-ink/56">{text}</p>
    </div>
  );
}

function getNextStep(status: SupabaseInvitation["status"]) {
  if (status === "draft") {
    return "edita tus datos, revisa la previsualización y guarda la sección Revisión final para enviarla al equipo.";
  }

  if (status === "in_review") {
    return "espera la revisión del equipo. Si necesitas corregir algo, actualiza la sección correspondiente y vuelve a guardar.";
  }

  return "copia tu enlace final y compártelo por WhatsApp con tus invitados.";
}

function InvitationPreviewCard({ invitation, planName }: { invitation: SupabaseInvitation | null; planName: string }) {
  const eventDate = invitation?.event_datetime ? new Date(invitation.event_datetime) : null;
  const galleryCount = invitation?.gallery_urls?.filter(Boolean).length ?? 0;

  return (
    <section className="sticky top-4 mb-5 rounded-[1.35rem] border border-black/10 bg-white p-6 shadow-[0_18px_65px_rgba(17,17,20,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b8892f]">Previsualización</p>
          <h2 className="mt-2 font-display text-4xl leading-none text-ink">Así va tu invitación</h2>
          <p className="mt-2 text-sm leading-6 text-ink/62">
            Revisa el resumen antes de enviarla. Si algo no se siente correcto, regresa a editar esa sección.
          </p>
        </div>
        <span className="rounded-full bg-[#f4ead4] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#8b641f]">{planName}</span>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.2rem] border border-ink/10 bg-[#111114] text-white">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(210,174,95,0.35),transparent_35%),linear-gradient(135deg,#151515,#243b31)] p-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d2ae5f]">{invitation?.design_template || "Diseño pendiente"}</p>
          <h3 className="mt-4 font-display text-4xl leading-none">Tu evento premium</h3>
          <p className="mt-4 text-sm font-semibold leading-6 text-white/74">
            {invitation?.custom_copy || "Cuando completes el copy, aquí verás el mensaje principal de tu invitación."}
          </p>
        </div>
        <div className="grid gap-3 p-4 text-sm sm:grid-cols-2">
          <PreviewItem label="Fecha" value={eventDate ? eventDate.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }) : "Pendiente"} />
          <PreviewItem label="Lugar" value={invitation?.event_location || "Pendiente"} />
          <PreviewItem label="WhatsApp" value={invitation?.whatsapp_number || "Pendiente"} />
          <PreviewItem label="Galería" value={`${galleryCount} fotos agregadas`} />
          <PreviewItem label="Mapa" value={invitation?.map_url ? "Agregado" : "Pendiente"} />
          <PreviewItem label="Dress code" value={invitation?.dresscode_text || "Pendiente"} />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#d2ae5f]/25 bg-[#f7f3eb] p-4 text-sm leading-6 text-ink/70">
        Antes de compartir, confirma que fecha, hora, dirección y WhatsApp estén correctos. Es lo que más ven tus invitados.
      </div>
    </section>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p className="text-[0.66rem] font-black uppercase tracking-[0.2em] text-[#d2ae5f]">{label}</p>
      <p className="mt-1 font-semibold text-white/82">{value}</p>
    </div>
  );
}

function ShareStatusCard({ invitation }: { invitation: SupabaseInvitation | null }) {
  const delivered = invitation?.status === "delivered";

  return (
    <section id="compartir" className="scroll-mt-28 rounded-[1.35rem] border border-black/10 bg-white p-6 shadow-[0_18px_65px_rgba(17,17,20,0.08)]">
      <div className="flex items-start gap-4">
        <span className="grid size-11 place-items-center rounded-2xl bg-[#f4ead4] text-[#b8892f]">
          <IconLink size={22} />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b8892f]">Compartir</p>
          <h2 className="mt-2 font-display text-3xl leading-none text-ink">{delivered ? "Tu enlace está listo" : "Tu enlace se activa al entregar"}</h2>
          <p className="mt-2 text-sm leading-6 text-ink/62">
            {delivered
              ? "Copia tu liga final y envíala por WhatsApp a tus invitados."
              : "Cuando el equipo termine la revisión, aquí tendrás el enlace final para compartir."}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!delivered}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white transition enabled:hover:bg-emerald disabled:cursor-not-allowed disabled:opacity-45"
        >
          Copiar enlace final
          <IconLink size={17} />
        </button>
        <a
          href="#editar"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-black text-ink transition hover:border-gold hover:text-emerald"
        >
          Corregir datos
          <IconPencil size={17} />
        </a>
      </div>
    </section>
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
        {section === "delivery" ? "Enviar a revisión" : `Guardar ${meta.title}`}
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
        <Textarea label="Lugar del evento" name="event_location" defaultValue={invitation?.event_location ?? ""} placeholder="Salón, hacienda, ciudad..." />
      </>
    );
  }

  if (section === "rsvp") {
    return (
      <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-4 text-sm font-black">
        <input type="checkbox" name="rsvp_enabled" defaultChecked={invitation?.rsvp_enabled ?? true} className="size-5 accent-[#1f513f]" />
        Activar confirmación RSVP
      </label>
    );
  }

  if (section === "whatsapp") {
    return <Input label="WhatsApp" name="whatsapp_number" defaultValue={invitation?.whatsapp_number ?? ""} placeholder="Ej. 8112345678" />;
  }

  if (section === "delivery") {
    return (
      <div className="rounded-2xl bg-[#f7f3eb] p-4 text-sm leading-6 text-ink/70">
        Cuando termines de editar y revisar la previsualización, presiona <strong>Enviar a revisión</strong>. El equipo revisará tu información antes de activar el enlace final.
      </div>
    );
  }

  if (section === "gallery") {
    return <Textarea label="URLs de galería" name="gallery_urls" defaultValue={(invitation?.gallery_urls ?? []).join("\n")} placeholder="Pega una URL por línea" />;
  }

  if (section === "qr") {
    return <p className="rounded-2xl bg-[#f7f3eb] p-4 text-sm leading-6 text-ink/70">El código QR se genera con la liga pública final de tu invitación.</p>;
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
        label="Dirección visual"
        name="visual_style"
        defaultValue={JSON.stringify(invitation?.visual_style ?? {}, null, 2)}
        placeholder='{"colores":"rosa, champagne", "mood":"deluxe"}'
      />
    );
  }

  if (section === "photo_optimize") {
    return <p className="rounded-2xl bg-[#f7f3eb] p-4 text-sm leading-6 text-ink/70">Guardaremos esta solicitud para optimizar tus fotos antes de entregar la invitación.</p>;
  }

  if (section === "revisions") {
    return <Textarea label="Notas de revisión" name="revision_notes" defaultValue={invitation?.revision_notes ?? ""} placeholder="Cambios, correcciones o ajustes que necesitas..." />;
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
