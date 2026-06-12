import type { DemoEvent } from "@/types";

export const demoEvents: Record<string, DemoEvent> = {
  xv: {
    type: "XV años",
    slug: "xv",
    host: "Familia Herrera",
    title: "Valentina XV",
    subtitle: "Una noche elegante para celebrar sus quince años con luz, música y recuerdos memorables.",
    story:
      "Valentina soñó una celebración con entrada de gala, flores en tonos blush y una pista lista para bailar toda la noche. Esta invitación acompaña ese momento con una experiencia digital fina, clara y emocionante.",
    date: "2026-11-21",
    time: "20:00",
    venue: "Salón Real Garden",
    address: "Av. Principal 120, Monterrey, N.L.",
    mapsUrl: "https://maps.google.com/?q=Monterrey+Nuevo+Leon",
    dressCode: "Formal elegante en tonos negro, champagne o blush",
    giftTable: "Lluvia de sobres opcional",
    music: "Vals moderno y playlist de celebración",
    heroImage: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1600&q=88",
    gallery: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=88",
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=88",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=88"
    ],
    whatsappMessage: "Hola, quiero confirmar mi asistencia a los XV años de Valentina.",
    accent: "#b76e79",
    secondaryAccent: "#f2d4dc",
    invitationNote: "Dress code, mesa de regalos, mapa, galería y RSVP en una sola experiencia."
  },
  boda: {
    type: "Bodas",
    slug: "boda",
    host: "Andrea & Mateo",
    title: "Andrea y Mateo",
    subtitle: "Nos casamos y queremos compartir este día contigo.",
    story:
      "Una boda íntima en hacienda, con cena al aire libre, flores blancas y una atmósfera cálida. La invitación se siente como la primera escena del evento: elegante, serena y lista para confirmar asistencia.",
    date: "2026-10-17",
    time: "18:30",
    venue: "Hacienda Santa Elena",
    address: "Carretera Nacional km 24, Monterrey, N.L.",
    mapsUrl: "https://maps.google.com/?q=Hacienda+Santa+Elena+Monterrey",
    dressCode: "Etiqueta formal",
    giftTable: "Mesa de regalos Palacio de Hierro 78910",
    music: "Ceremonia acústica y recepción lounge",
    heroImage: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=88",
    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=88",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=88",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1000&q=88"
    ],
    whatsappMessage: "Hola, quiero confirmar mi asistencia a la boda de Andrea y Mateo.",
    accent: "#204b3b",
    secondaryAccent: "#d8c29a",
    invitationNote: "Mapa, RSVP, música, código QR y mesa de regalos en una invitación de boda premium."
  },
  bautizo: {
    type: "Bautizos",
    slug: "bautizo",
    host: "Familia Ríos",
    title: "Bautizo de Santiago",
    subtitle: "Gracias por acompañarnos en este momento tan especial.",
    story:
      "Una ceremonia luminosa, familiar y llena de significado. La invitación mantiene una estética limpia y celestial, con la información esencial presentada con calma, ternura y elegancia.",
    date: "2026-09-05",
    time: "12:00",
    venue: "Parroquia San José",
    address: "Centro, Saltillo, Coah.",
    mapsUrl: "https://maps.google.com/?q=Saltillo+Coahuila",
    dressCode: "Tonos claros: blanco, beige o azul cielo",
    giftTable: "Tu presencia y oración son el mejor regalo",
    music: "Música instrumental suave para ceremonia",
    heroImage: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=88",
    gallery: [
      "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1000&q=88",
      "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1000&q=88",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=88"
    ],
    whatsappMessage: "Hola, quiero confirmar mi asistencia al bautizo de Santiago.",
    accent: "#5b8fb9",
    secondaryAccent: "#d9ebf7",
    invitationNote: "Una experiencia delicada para compartir ceremonia, recepción, ubicación y RSVP."
  },
  cumple: {
    type: "Cumpleaños",
    slug: "cumple",
    host: "Carlos",
    title: "Carlos 30",
    subtitle: "Una celebración premium con buena música y grandes momentos.",
    story:
      "La noche empieza desde el primer mensaje. Esta invitación presenta el mood de la fiesta con visuales intensos, horarios claros, ubicación, RSVP y un acceso moderno por QR.",
    date: "2026-08-29",
    time: "21:00",
    venue: "Terraza Urbana",
    address: "Zona Centro, CDMX",
    mapsUrl: "https://maps.google.com/?q=Ciudad+de+Mexico+Centro",
    dressCode: "Black chic",
    giftTable: "Sin regalos, solo tu presencia",
    music: "Deep house, pop latino y clásicos de fiesta",
    heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=88",
    gallery: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=88",
      "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1000&q=88",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=88"
    ],
    whatsappMessage: "Hola, quiero confirmar mi asistencia al cumpleaños de Carlos.",
    accent: "#7c2dff",
    secondaryAccent: "#ff5fb7",
    invitationNote: "Fiesta, RSVP, mapa, música, galería y QR con una estética nocturna premium."
  },
  "baby-shower": {
    type: "Baby Shower",
    slug: "baby-shower",
    host: "Familia Mayorga",
    title: "Baby Shower de Isabella",
    subtitle: "Una tarde dulce para celebrar la llegada de nuestra bebé.",
    story:
      "Antes de tenerla en brazos, queremos reunir a quienes ya la quieren. Será una celebración íntima, delicada y llena de pequeños detalles pensados para Isabella.",
    date: "2026-11-21",
    time: "16:30",
    venue: "Jardín Casa Magnolia",
    address: "Monterrey, N.L.",
    mapsUrl: "https://maps.google.com/?q=Monterrey+Nuevo+Leon",
    dressCode: "Rosa blush, blanco, beige o champagne",
    giftTable: "Mesa de regalos Liverpool 123456",
    music: "Melodía suave de bienvenida",
    heroImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1600&q=88",
    gallery: [
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1000&q=88",
      "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1000&q=88",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=88"
    ],
    whatsappMessage: "Hola, quiero confirmar mi asistencia al Baby Shower de Isabella.",
    accent: "#b96d7d",
    secondaryAccent: "#f4dfb8",
    invitationNote: "Una invitación tierna y deluxe con RSVP, ubicación, música, mesa de regalos y QR."
  }
};
