import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kompralo.com.mx";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kompralo Invitaciones Digitales Premium",
    template: "%s | Kompralo Invitaciones"
  },
  description:
    "Invitaciones digitales premium para XV años, bodas, bautizos y cumpleaños en México. Diseño elegante, RSVP, WhatsApp, galería, música, mapas y código QR.",
  keywords: [
    "invitaciones digitales",
    "invitaciones XV años",
    "invitaciones boda",
    "invitaciones bautizo",
    "invitaciones cumpleaños",
    "invitaciones digitales México",
    "Kompralo"
  ],
  openGraph: {
    title: "Kompralo Invitaciones Digitales Premium",
    description:
      "Invitaciones digitales premium con diseño elegante, RSVP, WhatsApp, galería, mapas y código QR.",
    url: `${baseUrl}/invitaciones`,
    siteName: "Kompralo",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/brand/kompralo-logo.png",
        width: 900,
        height: 668,
        alt: "Invitaciones digitales premium Kompralo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kompralo Invitaciones Digitales Premium",
    description: "Invitaciones digitales premium listas para vender en México."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
