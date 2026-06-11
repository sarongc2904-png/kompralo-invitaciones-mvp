import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-ink text-pearl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Image
            src="/brand/kompralo-logo.png"
            alt="Kompralo Invitaciones Digitales Premium"
            width={900}
            height={668}
            sizes="(min-width: 768px) 360px, 260px"
            className="h-auto w-64 rounded-xl shadow-[0_22px_80px_rgba(0,0,0,0.28)] md:w-80"
          />
          <p className="mt-5 max-w-md text-sm leading-6 text-pearl/68">
            Invitaciones digitales premium para eventos memorables. Diseñadas para vender valor,
            confirmar asistencia y verse impecables en celular.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-black uppercase tracking-[0.18em] text-gold">Explorar</p>
          <div className="grid gap-2 text-pearl/70">
            <Link href="/modelos">Modelos</Link>
            <Link href="/precios">Precios</Link>
            <Link href="/formulario">Crear invitación</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-black uppercase tracking-[0.18em] text-gold">Demos</p>
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
