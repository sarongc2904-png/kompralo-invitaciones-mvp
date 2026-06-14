import { redirect } from "next/navigation";

// The old form has been replaced by the 6-step wizard at /crear.
export default function FormularioPage() {
  redirect("/crear");
}
