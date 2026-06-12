import type { MetadataRoute } from "next";

const routes = [
  "/invitaciones",
  "/modelos",
  "/precios",
  "/pago-exitoso",
  "/gracias",
  "/login",
  "/registro",
  "/recuperar",
  "/dashboard",
  "/demo/xv",
  "/demo/boda",
  "/demo/bautizo",
  "/demo/cumple"
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kompralo.com.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/invitaciones" ? 1 : 0.7
  }));
}
