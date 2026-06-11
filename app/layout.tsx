import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kompralo.com.mx";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kompralo Invitaciones Digitales Premium",
    template: "%s | Kompralo Invitaciones"
  },
  description:
    "Invitaciones digitales premium para XV años, bodas, bautizos y cumpleaños. Diseño elegante, RSVP, WhatsApp, galería, música, mapas y código QR.",
  keywords: [
    "invitaciones digitales",
    "invitaciones xv años",
    "invitaciones boda",
    "invitaciones bautizo",
    "invitaciones cumpleaños",
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
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Invitaciones digitales premium Kompralo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kompralo Invitaciones Digitales Premium",
    description: "Invitaciones digitales premium listas para vender en Mexico."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
