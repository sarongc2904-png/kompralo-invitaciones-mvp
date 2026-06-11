"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppButton() {
  return (
    <a
      href={buildWhatsAppUrl("Hola, quiero información sobre una invitación digital.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-emerald text-white shadow-glow transition hover:-translate-y-1"
      title="WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}
