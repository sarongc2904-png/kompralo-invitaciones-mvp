import { RegisterForm } from "@/components/auth/RegisterForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata = {
  title: "Registro"
};

export default function RegistroPage() {
  return (
    <section className="soft-pattern px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <SectionHeading eyebrow="Cuenta cliente" title="Crear cuenta" description="Regístrate para administrar tus invitaciones digitales." />
        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
