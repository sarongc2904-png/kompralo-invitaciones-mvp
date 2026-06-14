import type { Plan } from "@/types";

export const plans: Plan[] = [
  {
    id: "boda",
    slug: "boda",
    name: "Invitación de Boda",
    price: "$799 MXN",
    oldPrice: "$1299",
    amount: 79900,
    description: "Invitación digital premium para tu boda con todos los módulos incluidos.",
    features: [
      "3 estilos visuales exclusivos",
      "Galería de fotos",
      "Cuenta regresiva",
      "RSVP digital",
      "Mapa interactivo",
      "Historia de amor",
      "Código QR",
      "Música de fondo",
    ],
  },
  {
    id: "esencial",
    slug: "esencial",
    name: "Esencial",
    oldPrice: "$799",
    price: "$499 MXN",
    amount: 49900,
    description: "Ideal para anunciar tu evento con elegancia y empezar a recibir confirmaciones sin complicarte.",
    features: ["Diseño elegante", "Fecha y hora claras", "RSVP para invitados", "Botón directo a WhatsApp", "Entrega lista para compartir"],
    sections: ["design", "datetime", "rsvp", "whatsapp", "delivery"]
  },
  {
    id: "completo",
    slug: "completo",
    name: "Completo",
    oldPrice: "$1299",
    price: "$799 MXN",
    amount: 79900,
    description: "Para eventos donde quieres que cada invitado tenga toda la información y sienta una experiencia completa.",
    features: ["Todo Esencial", "Galería para emocionar", "Código QR de acceso", "Mesa de regalos", "Dress code", "Mapa de llegada"],
    sections: ["design", "datetime", "rsvp", "whatsapp", "delivery", "gallery", "qr", "gift_table", "dresscode", "map"],
    highlighted: true
  },
  {
    id: "premium",
    slug: "premium",
    name: "Premium",
    oldPrice: "$2199",
    price: "$1499 MXN",
    amount: 149900,
    description: "La opción deluxe para una invitación hecha a tu estilo, con copy cuidado y acompañamiento premium.",
    features: ["Todo Completo", "Texto personalizado", "Dirección visual deluxe", "Optimización de fotos", "Revisiones incluidas", "Soporte prioritario"],
    sections: [
      "design",
      "datetime",
      "rsvp",
      "whatsapp",
      "delivery",
      "gallery",
      "qr",
      "gift_table",
      "dresscode",
      "map",
      "custom_copy",
      "visual_style",
      "photo_optimize",
      "revisions",
      "support"
    ],
    badge: "Todo incluido"
  }
];
