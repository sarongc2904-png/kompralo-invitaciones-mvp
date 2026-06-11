import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireApiUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "No autenticado." }, { status: 401 }) };
  }

  return { session };
}

export async function requireApiAdmin() {
  const result = await requireApiUser();

  if ("error" in result) {
    return result;
  }

  if (result.session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "No autorizado." }, { status: 403 }) };
  }

  return result;
}
