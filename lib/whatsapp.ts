export const salesWhatsApp = "5210000000000";

export function buildWhatsAppUrl(message: string, phone = salesWhatsApp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
