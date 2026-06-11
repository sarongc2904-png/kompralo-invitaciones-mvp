import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-ink text-pearl">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-2xl">Kompralo Invitaciones</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-pearl/70">
            Invitaciones digitales premium para eventos memorables. Creadas para vender rapido,
            lucir elegantes y compartirse perfecto en celular.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-gold">Explorar</p>
          <div className="grid gap-2 text-pearl/70">
            <Link href="/modelos">Modelos</Link>
            <Link href="/precios">Precios</Link>
            <Link href="/formulario">Formulario</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-gold">Demos</p>
          <div className="grid gap-2 text-pearl/70">
            <Link href="/demo/xv">XV años</Link>
            <Link href="/demo/boda">Boda</Link>
            <Link href="/demo/bautizo">Bautizo</Link>
            <Link href="/demo/cumple">Cumpleaños</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
