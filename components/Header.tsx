"use client";

import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/invitaciones", label: "Inicio" },
  { href: "/modelos", label: "Modelos" },
  { href: "/precios", label: "Precios" },
  { href: "/formulario", label: "Crear invitación" },
  { href: "/dashboard", label: "Dashboard" }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-pearl/88 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/invitaciones" className="flex min-w-0 items-center gap-3 text-ink" onClick={closeMenu}>
          <span className="relative block size-11 shrink-0 overflow-hidden rounded-full bg-ink shadow-[0_14px_35px_rgba(17,17,20,0.16)] ring-1 ring-gold/45 sm:size-12">
            <Image src="/brand/kompralo-k-icon.png" alt="Kompralo" fill sizes="48px" className="object-cover" priority />
          </span>
          <span className="truncate font-display text-2xl leading-none sm:text-3xl">
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

        <div className="hidden items-center md:flex">
          <Link
            href="/login"
            className="rounded-full border border-ink/10 bg-white/45 px-4 py-2 text-xs font-bold text-ink/62 transition hover:border-gold hover:text-ink"
          >
            Entrar
          </Link>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
          className="ml-3 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink shadow-[0_12px_30px_rgba(17,17,20,0.08)] transition active:scale-95 md:hidden"
        >
          {isMenuOpen ? <IconX size={22} stroke={2} /> : <IconMenu2 size={22} stroke={2} />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-ink/5 bg-pearl/96 px-4 pb-5 pt-2 shadow-[0_24px_60px_rgba(17,17,20,0.12)] md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.href}-${item.label}`}
                href={item.href}
                onClick={closeMenu}
                className="rounded-2xl border border-ink/8 bg-white/64 px-4 py-4 text-base font-black text-ink transition active:scale-[0.99]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={closeMenu}
              className="mt-2 rounded-full bg-ink px-5 py-4 text-center text-base font-black text-white shadow-[0_18px_40px_rgba(17,17,20,0.18)]"
            >
              Entrar
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
