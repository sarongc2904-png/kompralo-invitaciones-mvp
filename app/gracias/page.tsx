import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Gracias"
};

export default function GraciasPage() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-pearl px-4 py-16">
      <div className="max-w-2xl rounded-lg bg-white p-8 text-center shadow-glow luxury-border">
        <CheckCircle2 className="mx-auto text-emerald" size={54} />
        <h1 className="mt-5 font-display text-4xl text-ink sm:text-5xl">Recibimos tu información</h1>
        <p className="mt-4 text-ink/65">
          Gracias. Tu solicitud quedó guardada en este MVP y el siguiente paso comercial es contactarte por WhatsApp.
        </p>
        <Link href="/invitaciones" className="mt-8 inline-flex rounded-md bg-ink px-6 py-3 text-sm font-bold text-pearl transition hover:bg-emerald">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
