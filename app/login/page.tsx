import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata = {
  title: "Login"
};

export default function LoginPage() {
  return (
    <section className="soft-pattern px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <SectionHeading eyebrow="Acceso" title="Entrar a Kompralo" description="Gestiona eventos, invitados, RSVP y plantillas." />
        <div className="mt-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
