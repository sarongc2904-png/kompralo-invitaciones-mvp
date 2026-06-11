import type { Plan } from "@/types";

export const plans: Plan[] = [
  {
    id: "basico",
    name: "Plan Básico",
    price: "$499 MXN",
    amount: 49900,
    description: "Invitación elegante para compartir por WhatsApp.",
    features: ["Portada premium", "Fecha, hora y ubicación", "Botón WhatsApp", "RSVP local"]
  },
  {
    id: "premium",
    name: "Plan Premium",
    price: "$799 MXN",
    amount: 79900,
    description: "Experiencia completa con secciones visuales y galería.",
    features: ["Todo el plan básico", "Galería de fotos", "Código QR", "Mesa de regalos", "Dress code"],
    highlighted: true
  },
  {
    id: "ia-premium",
    name: "Plan IA Premium",
    price: "$1499 MXN",
    amount: 149900,
    description: "Diseño personalizado con estilo premium y apoyo creativo IA.",
    features: ["Todo el plan premium", "Copy personalizado", "Look visual a medida", "Optimización de fotos"]
  }
];
