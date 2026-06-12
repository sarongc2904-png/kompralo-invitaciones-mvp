import { Suspense } from "react";
import { EventForm } from "@/components/EventForm";

export const metadata = {
  title: "Crear invitacion | Kompralo",
  description: "Crea el borrador de tu invitacion digital, previsualizalo y finaliza tu compra con pago seguro."
};

export default function FormularioPage() {
  return (
    <main className="bg-pearl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">Crear invitacion</p>
          <h1 className="mt-4 font-display text-5xl leading-none text-ink sm:text-6xl">
            Disena tu invitacion antes de pagar.
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink/66">
            Completa los datos principales, revisa una previsualizacion y cuando estes listo elige tu plan para finalizar con Stripe.
          </p>
        </div>
        <Suspense fallback={<div className="rounded-lg bg-white p-8 shadow-glow luxury-border">Cargando editor...</div>}>
          <EventForm />
        </Suspense>
      </section>
    </main>
  );
}
