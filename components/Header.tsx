import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/invitaciones", label: "Inicio" },
  { href: "/modelos", label: "Modelos" },
  { href: "/precios", label: "Precios" },
  { href: "/formulario", label: "Crear invitacion" },
  { href: "/dashboard", label: "Dashboard" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-pearl/84 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/invitaciones" className="flex items-center gap-3 text-ink">
          <span className="relative block size-12 overflow-hidden rounded-full bg-ink shadow-[0_14px_35px_rgba(17,17,20,0.16)] ring-1 ring-gold/45">
            <Image src="/brand/kompralo-k-icon.png" alt="Kompralo" fill sizes="48px" className="object-cover" priority />
          </span>
          <span className="font-display text-2xl leading-none sm:text-3xl">
            kompralo<span className="text-base text-ink/70 sm:text-lg">.com.mx</span>
          </span>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-ink/62 md:flex">
          {navItems.map((item) => (
            <Link key={`${item.href}-${item.label}`} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/login"
          className="rounded-full border border-ink/10 bg-white/45 px-4 py-2 text-xs font-bold text-ink/62 transition hover:border-gold hover:text-ink"
        >
          Entrar
        </Link>
      </nav>
    </header>
  );
}
