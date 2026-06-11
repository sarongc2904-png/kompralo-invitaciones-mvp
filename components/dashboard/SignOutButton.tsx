"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-md border border-ink/12 px-4 py-2 text-sm font-semibold text-ink transition hover:border-gold"
    >
      Salir
    </button>
  );
}
