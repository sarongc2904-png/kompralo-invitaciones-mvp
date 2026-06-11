import type { DemoEvent } from "@/types";

export const demoEvents: Record<string, DemoEvent> = {
  xv: {
    type: "XV años",
    slug: "xv",
    host: "Familia Herrera",
    title: "Valentina XV",
    subtitle: "Una noche dorada para celebrar sus quince años",
    date: "2026-11-21",
    time: "20:00",
    venue: "Salon Real Garden",
    address: "Av. Principal 120, Monterrey, N.L.",
    mapsUrl: "https://maps.google.com/?q=Monterrey+Nuevo+Leon",
    dressCode: "Formal elegante",
    giftTable: "Mesa de regalos Liverpool 123456",
    heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80"
    ],
    whatsappMessage: "Hola, quiero confirmar mi asistencia a los XV de Valentina.",
    accent: "#b76e79"
  },
  boda: {
    type: "Bodas",
    slug: "boda",
    host: "Andrea & Mateo",
    title: "Andrea y Mateo",
    subtitle: "Nos casamos y queremos compartir este dia contigo",
    date: "2026-10-17",
    time: "18:30",
    venue: "Hacienda Santa Elena",
    address: "Carretera Nacional km 24, Monterrey, N.L.",
    mapsUrl: "https://maps.google.com/?q=Hacienda+Santa+Elena+Monterrey",
    dressCode: "Etiqueta formal",
    giftTable: "Mesa de regalos Palacio de Hierro 78910",
    heroImage: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
    ],
    whatsappMessage: "Hola, quiero confirmar mi asistencia a la boda de Andrea y Mateo.",
    accent: "#204b3b"
  },
  bautizo: {
    type: "Bautizos",
    slug: "bautizo",
    host: "Familia Rios",
    title: "Bautizo de Santiago",
    subtitle: "Gracias por acompañarnos en este momento tan especial",
    date: "2026-09-05",
    time: "12:00",
    venue: "Parroquia San Jose",
    address: "Centro, Saltillo, Coah.",
    mapsUrl: "https://maps.google.com/?q=Saltillo+Coahuila",
    dressCode: "Tonos claros",
    giftTable: "Lluvia de sobres opcional",
    heroImage: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80"
    ],
    whatsappMessage: "Hola, quiero confirmar mi asistencia al bautizo de Santiago.",
    accent: "#5b8fb9"
  },
  cumple: {
    type: "Cumpleaños",
    slug: "cumple",
    host: "Carlos",
    title: "Carlos 30",
    subtitle: "Una celebracion premium con buena musica y grandes momentos",
    date: "2026-08-29",
    time: "21:00",
    venue: "Terraza Urbana",
    address: "Zona Centro, CDMX",
    mapsUrl: "https://maps.google.com/?q=Ciudad+de+Mexico+Centro",
    dressCode: "Black chic",
    giftTable: "Sin regalos, solo tu presencia",
    heroImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80"
    ],
    whatsappMessage: "Hola, quiero confirmar mi asistencia al cumpleaños de Carlos.",
    accent: "#8e2de2"
  }
};
