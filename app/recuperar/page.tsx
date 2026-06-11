import { Suspense } from "react";
import { RecoverForm } from "@/components/auth/RecoverForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata = {
  title: "Recuperar contraseña"
};

export default function RecuperarPage() {
  return (
    <section className="soft-pattern px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <SectionHeading eyebrow="Seguridad" title="Recuperar contraseña" description="Solicita un enlace de recuperación o actualiza tu contraseña con un token válido." />
        <div className="mt-8">
          <Suspense>
            <RecoverForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
