import { redirect } from "next/navigation"
import { auth } from "@/auth"
import CrearWizard from "./CrearWizard"

export const metadata = { title: "Crear invitación de boda" }

export default async function CrearPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/crear")
  }
  return <CrearWizard />
}
