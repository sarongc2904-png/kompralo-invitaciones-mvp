import type { Plan } from "@/types";

export const plans: Plan[] = [
  {
    id: "esencial",
    slug: "esencial",
    name: "Esencial",
    oldPrice: "$799",
    price: "$499 MXN",
    amount: 49900,
    description: "Ideal para anunciar tu evento con elegancia y empezar a recibir confirmaciones sin complicarte.",
    features: ["Diseno elegante", "Fecha y hora claras", "RSVP para invitados", "Boton directo a WhatsApp", "Entrega lista para compartir"],
    sections: ["design", "datetime", "rsvp", "whatsapp", "delivery"]
  },
  {
    id: "completo",
    slug: "completo",
    name: "Completo",
    oldPrice: "$1299",
    price: "$799 MXN",
    amount: 79900,
    description: "Para eventos donde quieres que cada invitado tenga toda la informacion y sienta una experiencia completa.",
    features: ["Todo Esencial", "Galeria para emocionar", "Codigo QR de acceso", "Mesa de regalos", "Dress code", "Mapa de llegada"],
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
    description: "La opcion deluxe para una invitacion hecha a tu estilo, con copy cuidado y acompanamiento premium.",
    features: ["Todo Completo", "Texto personalizado", "Direccion visual deluxe", "Optimizacion de fotos", "Revisiones incluidas", "Soporte prioritario"],
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
