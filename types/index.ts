export type EventCategory = "XV años" | "Bodas" | "Bautizos" | "Cumpleaños";

export type Template = {
  id: string;
  name: string;
  category: EventCategory;
  previewUrl: string;
  imageUrl: string;
  palette: string;
};

export type Plan = {
  id: string;
  name: string;
  price: string;
  amount: number;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export type DemoEvent = {
  type: EventCategory;
  slug: string;
  host: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
  dressCode: string;
  giftTable: string;
  heroImage: string;
  gallery: string[];
  whatsappMessage: string;
  accent: string;
};
