import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  stripe ??= new Stripe(secretKey);
  return stripe;
}

export function getBaseUrl(requestOrigin?: string | null) {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL?.replace(/^/, "https://") ||
    requestOrigin ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
