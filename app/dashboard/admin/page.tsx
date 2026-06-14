import Link from "next/link";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  LayoutTemplate,
  Pencil,
  ShoppingCart,
  Users
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin, type SupabaseInvitation, type SupabaseOrder } from "@/lib/supabase-admin";
import { plans } from "@/data/plans";

export const dynamic = "force-dynamic";

type UserSummary = {
  id: string;
  name: string | null;
  email: string;
};

type SupabaseAdminData = {
  ready: boolean;
  orders: SupabaseOrder[];
  invitations: SupabaseInvitation[];
};

const statusCopy = {
  draft: { label: "Borrador", className: "bg-amber-50 text-amber-800 border-amber-200" },
  in_review: { label: "En revision", className: "bg-blue-50 text-blue-800 border-blue-200" },
  delivered: { label: "Entregada", className: "bg-emerald-50 text-emerald-800 border-emerald-200" }
};

export default async function AdminPage() {
  const session = await requireAdmin();
  const [users, events, templates, supabaseData] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.event.count().catch(() => 0),
    prisma.template.count().catch(() => 0),
    fetchSupabaseAdminData()
  ]);

  const userIds = Array.from(
    new Set([...supabaseData.orders.map((order) => order.user_id), ...supabaseData.invitations.map((invitation) => invitation.user_id)].filter(Boolean))
  );
  const userRows = userIds.length
    ? await prisma.user
        .findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true }
        })
        .catch(() => [] as UserSummary[])
    : [];
  const usersById = new Map(userRows.map((user) => [user.id, user]));
  const invitationsByOrderId = new Map(supabaseData.invitations.map((invitation) => [invitation.order_id, invitation]));
  const inReview = supabaseData.invitations.filter((invitation) => invitation.status === "in_review").length;

  return (
    <DashboardShell title="Administrador" description="Operacion global de compradores, plantillas e invitaciones." role={session.user.role}>
      {!supabaseData.ready ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 shrink-0" size={18} />
          <p>Supabase aun no esta disponible en el servidor. Revisa las variables para ver pedidos e invitaciones compradas.</p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminMetric icon={Users} label="Usuarios" value={users} />
        <AdminMetric icon={CalendarDays} label="Eventos" value={events} />
        <AdminMetric icon={LayoutTemplate} label="Plantillas" value={templates} href="/dashboard/admin/plantillas" />
        <AdminMetric icon={ShoppingCart} label="Pedidos recientes" value={supabaseData.orders.length} />
        <AdminMetric icon={CheckCircle2} label="En revision" value={inReview} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.5rem] border border-ink/10 bg-white p-5 shadow-glow">
          <div className="flex flex-col gap-2 border-b border-ink/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-gold">Compras</p>
              <h2 className="mt-2 font-display text-3xl text-ink">Pedidos recientes</h2>
            </div>
            <p className="text-sm text-ink/58">Aqui ves que compro cada cliente y puedes abrir su invitacion.</p>
          </div>

          <div className="mt-4 space-y-3">
            {supabaseData.orders.length ? (
              supabaseData.orders.map((order) => {
                const invitation = invitationsByOrderId.get(order.id);
                const user = usersById.get(order.user_id);
                const plan = plans.find((item) => item.slug === order.plan_slug);

                return (
                  <div key={order.id} className="grid gap-4 rounded-2xl border border-ink/10 bg-[#fbfaf7] p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-ink">{getUserLabel(user, order.user_id)}</p>
                        <StatusBadge status={invitation?.status ?? "draft"} />
                      </div>
                      <p className="mt-1 text-sm text-ink/58">{user?.email ?? "Cliente sin correo visible"}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-ink/62">
                        <span className="rounded-full bg-white px-3 py-1">Plan {plan?.name ?? order.plan_slug}</span>
                        <span className="rounded-full bg-white px-3 py-1">Pago {formatDate(order.paid_at ?? order.created_at)}</span>
                      </div>
                    </div>
                    {invitation ? (
                      <Link href={`/dashboard/admin/invitaciones/${invitation.id}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-pearl transition hover:bg-emerald">
                        <Pencil size={15} />
                        Editar invitacion
                      </Link>
                    ) : (
                      <span className="rounded-full border border-ink/10 px-4 py-2 text-sm font-bold text-ink/52">Sin invitacion</span>
                    )}
                  </div>
                );
              })
            ) : (
              <EmptyState text="Todavia no hay pedidos recientes desde Stripe." />
            )}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-ink/10 bg-white p-5 shadow-glow">
          <div className="border-b border-ink/10 pb-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-gold">Soporte</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Invitaciones recientes</h2>
            <p className="mt-1 text-sm text-ink/58">Entra, corrige datos y deja lista la invitacion si el cliente se atora.</p>
          </div>

          <div className="mt-4 space-y-3">
            {supabaseData.invitations.length ? (
              supabaseData.invitations.map((invitation) => {
                const user = usersById.get(invitation.user_id);

                return (
                  <div key={invitation.id} className="rounded-2xl border border-ink/10 bg-[#fbfaf7] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-ink">{invitation.design_template || "Sin diseno elegido"}</p>
                        <p className="mt-1 text-sm text-ink/58">{getUserLabel(user, invitation.user_id)}</p>
                      </div>
                      <StatusBadge status={invitation.status} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">{formatDate(invitation.updated_at ?? invitation.created_at)}</span>
                      <Link href={`/dashboard/admin/invitaciones/${invitation.id}`} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold text-ink transition hover:border-gold hover:text-emerald">
                        <Pencil size={15} />
                        Abrir
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState text="Todavia no hay invitaciones compradas para editar." />
            )}
          </div>
        </section>
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-gold/30 bg-gold/10 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-gold">Operacion clara</p>
            <h2 className="mt-2 font-display text-3xl text-ink">El administrador ve todo. El cliente solo ve su invitacion.</h2>
            <p className="mt-2 max-w-3xl text-sm text-ink/62">
              Usa este panel para revisar pedidos, abrir la invitacion del comprador, corregir textos, completar datos faltantes y marcarla como entregada.
            </p>
          </div>
          <Link href="/dashboard/admin/plantillas" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-pearl transition hover:bg-emerald">
            <LayoutTemplate size={16} />
            Administrar plantillas
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}

async function fetchSupabaseAdminData(): Promise<SupabaseAdminData> {
  try {
    const supabase = getSupabaseAdmin();
    const [ordersResult, invitationsResult] = await Promise.all([
      supabase.from("orders").select("id,user_id,plan_slug,stripe_session_id,paid_at,created_at").order("paid_at", { ascending: false }).limit(8),
      supabase.from("invitations").select("*").order("updated_at", { ascending: false }).limit(8)
    ]);

    return {
      ready: !ordersResult.error && !invitationsResult.error,
      orders: (ordersResult.data ?? []) as SupabaseOrder[],
      invitations: (invitationsResult.data ?? []) as SupabaseInvitation[]
    };
  } catch {
    return { ready: false, orders: [], invitations: [] };
  }
}

function AdminMetric({ icon: Icon, label, value, href }: { icon: typeof Users; label: string; value: number; href?: string }) {
  const content = (
    <div className="h-full rounded-[1.25rem] border border-ink/10 bg-white p-5 shadow-glow transition hover:-translate-y-0.5 hover:border-gold">
      <Icon className="text-gold" size={24} />
      <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-ink/48">{label}</p>
      <p className="mt-2 font-display text-4xl text-ink">{value}</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function StatusBadge({ status }: { status: SupabaseInvitation["status"] }) {
  const copy = statusCopy[status] ?? statusCopy.draft;

  return <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${copy.className}`}>{copy.label}</span>;
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/12 bg-[#fbfaf7] p-6 text-sm font-semibold text-ink/52">
      {text}
    </div>
  );
}

function getUserLabel(user: UserSummary | undefined, fallback: string) {
  return user?.name || user?.email || fallback;
}

function formatDate(value?: string | null) {
  if (!value) return "pendiente";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "pendiente";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}
