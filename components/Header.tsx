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
    <header className="sticky top-0 z-40 border-b border-gold/18 bg-pearl/84 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/invitaciones" className="flex items-center gap-3 font-display text-2xl text-ink">
          <span className="grid size-10 place-items-center rounded-full bg-ink text-gold shadow-[0_14px_35px_rgba(17,17,20,0.16)]">
            <Sparkles size={18} />
          </span>
          Kompralo
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-ink/62 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/login"
          className="rounded-full bg-ink px-5 py-3 text-sm font-black text-pearl shadow-[0_18px_50px_rgba(17,17,20,0.16)] transition hover:-translate-y-0.5 hover:bg-emerald"
        >
          Entrar
        </Link>
      </nav>
    </header>
  );
}
