import Link from "next/link";
import { SignOutButton } from "./SignOutButton";

type DashboardShellProps = {
  title: string;
  description?: string;
  role?: string;
  children: React.ReactNode;
};

export function DashboardShell({ title, description, role, children }: DashboardShellProps) {
  return (
    <section className="min-h-screen bg-pearl">
      <div className="border-b border-gold/20 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">{role ?? "Dashboard"}</p>
            <h1 className="mt-2 font-display text-4xl text-ink">{title}</h1>
            {description ? <p className="mt-2 text-sm text-ink/62">{description}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/dashboard" className="rounded-md border border-ink/12 px-4 py-2 text-sm font-semibold text-ink">Inicio</Link>
            <Link href="/dashboard/eventos" className="rounded-md border border-ink/12 px-4 py-2 text-sm font-semibold text-ink">Eventos</Link>
            <Link href="/dashboard/admin" className="rounded-md border border-ink/12 px-4 py-2 text-sm font-semibold text-ink">Admin</Link>
            <SignOutButton />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
