import { Suspense } from "react";
import { EventForm } from "@/components/EventForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata = {
  title: "Formulario"
};

export default function FormularioPage() {
  return (
    <section className="soft-pattern px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Información del evento"
          title="Cuéntanos todo para crear tu invitación"
          description="Al enviar el formulario se crea una invitación pública y publicada, lista para compartir con tus invitados."
        />
        <div className="mt-10">
          <Suspense fallback={<div className="rounded-lg bg-white p-8 shadow-glow">Cargando formulario...</div>}>
            <EventForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
