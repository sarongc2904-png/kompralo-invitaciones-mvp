"use client";

import { IconArrowLeft, IconChevronRight, IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/invitaciones", label: "Inicio" },
  { href: "/modelos", label: "Modelos" },
  { href: "/precios", label: "Precios" },
  { href: "/crear", label: "Crear invitación" },
  { href: "/dashboard", label: "Dashboard" }
];

const quickSectionItems = [
  { href: "/invitaciones#como-funciona", label: "Cómo funciona" },
  { href: "/invitaciones#beneficios", label: "Beneficios" },
  { href: "/invitaciones#comparativa", label: "Comparativa" },
  { href: "/invitaciones#faq", label: "FAQ" }
];

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const goBack = () => {
    closeMenu();

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/invitaciones");
  };

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

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/35 px-4 py-2 text-xs font-bold text-ink/56 transition hover:border-gold hover:text-ink"
          >
            <IconArrowLeft size={15} />
            Atrás
          </button>
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-pearl/98 px-5 pb-8 pt-4 shadow-[0_24px_60px_rgba(17,17,20,0.16)] backdrop-blur-2xl md:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between border-b border-ink/8 pb-4">
            <Link href="/invitaciones" className="flex min-w-0 items-center gap-3 text-ink" onClick={closeMenu}>
              <span className="relative block size-12 shrink-0 overflow-hidden rounded-full bg-ink shadow-[0_14px_35px_rgba(17,17,20,0.16)] ring-1 ring-gold/45">
                <Image src="/brand/kompralo-k-icon.png" alt="Kompralo" fill sizes="48px" className="object-cover" priority />
              </span>
              <span className="truncate font-display text-3xl leading-none">
                kompralo<span className="text-lg text-ink/70">.com.mx</span>
              </span>
            </Link>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={closeMenu}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink shadow-[0_12px_30px_rgba(17,17,20,0.08)] active:scale-95"
            >
              <IconX size={22} stroke={2} />
            </button>
          </div>

          <div className="mx-auto grid max-w-lg gap-5 pt-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-3 text-sm font-black text-ink shadow-[0_12px_30px_rgba(17,17,20,0.08)] active:scale-[0.99]"
              >
                <IconArrowLeft size={17} />
                Volver
              </button>
              <Link
                href="/login"
                onClick={closeMenu}
                className="ml-auto rounded-full bg-ink px-5 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(17,17,20,0.18)]"
              >
                Entrar
              </Link>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-gold">Navegación</p>
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={`mobile-${item.href}-${item.label}`}
                    href={item.href}
                    onClick={closeMenu}
                    className="group flex items-center justify-between rounded-[1.35rem] border border-ink/8 bg-white/72 px-4 py-4 text-base font-black text-ink shadow-[0_12px_30px_rgba(17,17,20,0.05)] transition active:scale-[0.99]"
                  >
                    {item.label}
                    <IconChevronRight size={18} className="text-gold transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-ink/8 bg-white/54 p-4 shadow-[0_18px_45px_rgba(17,17,20,0.06)]">
              <p className="pb-3 text-[11px] font-black uppercase tracking-[0.24em] text-gold">Secciones rápidas</p>
              <div className="grid grid-cols-2 gap-2">
                {quickSectionItems.map((item) => (
                  <Link
                    key={`quick-${item.href}-${item.label}`}
                    href={item.href}
                    onClick={closeMenu}
                    className="rounded-2xl bg-pearl px-3 py-3 text-sm font-black text-ink/76 shadow-inner shadow-white/70 transition active:scale-[0.99]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/modelos"
              onClick={closeMenu}
              className="rounded-full bg-ink px-5 py-4 text-center text-base font-black text-white shadow-[0_18px_40px_rgba(17,17,20,0.18)]"
            >
              Ver modelos disponibles
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
