import Link from "next/link";
import { BarChart3, CalendarDays, Heart, Home, LayoutTemplate, Shield, Sparkles } from "lucide-react";
import { SignOutButton } from "./SignOutButton";

type DashboardShellProps = {
  title: string;
  description?: string;
  role?: string;
  children: React.ReactNode;
};

const dashboardNav = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/dashboard/invitaciones", label: "Mis bodas", icon: Heart },
  { href: "/dashboard/admin", label: "Admin", icon: Shield, adminOnly: true },
  { href: "/dashboard/admin/plantillas", label: "Plantillas", icon: LayoutTemplate, adminOnly: true }
];

export function DashboardShell({ title, description, role, children }: DashboardShellProps) {
  return (
    <section className="min-h-screen bg-[#f7f7f4]">
      <div className="border-b border-ink/8 bg-white/86 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <span className="mt-1 grid size-11 place-items-center rounded-2xl bg-ink text-gold">
              <Sparkles size={19} />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gold">{role ?? "Dashboard"}</p>
              <h1 className="mt-2 font-display text-4xl leading-none text-ink">{title}</h1>
              {description ? <p className="mt-2 text-sm text-ink/62">{description}</p> : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {dashboardNav.filter((item) => !item.adminOnly || role === "ADMIN").map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold text-ink transition hover:border-gold hover:text-emerald">
                <item.icon size={15} />
                {item.label}
              </Link>
            ))}
            <SignOutButton />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-4 rounded-[1.5rem] bg-ink p-6 text-pearl shadow-[0_24px_80px_rgba(17,17,20,0.16)] md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-gold">Centro de control</p>
            <p className="mt-2 text-sm text-pearl/68">Gestiona clientes, eventos, RSVP, plantillas y pagos desde un solo lugar.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-pearl/10 px-4 py-3 text-sm">
            <BarChart3 className="text-gold" size={18} />
            SaaS operativo
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
