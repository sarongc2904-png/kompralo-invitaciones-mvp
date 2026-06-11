import Link from "next/link";
import { Sparkles } from "lucide-react";

const navItems = [
  { href: "/invitaciones", label: "Inicio" },
  { href: "/modelos", label: "Modelos" },
  { href: "/precios", label: "Precios" },
  { href: "/formulario", label: "Crear invitación" },
  { href: "/dashboard", label: "Dashboard" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-pearl/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/invitaciones" className="flex items-center gap-2 font-display text-xl text-ink">
          <span className="grid size-9 place-items-center rounded-full bg-ink text-gold">
            <Sparkles size={18} />
          </span>
          Kompralo
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-ink/70 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/login"
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-pearl shadow-glow transition hover:-translate-y-0.5 hover:bg-emerald"
        >
          Entrar
        </Link>
      </nav>
    </header>
  );
}
