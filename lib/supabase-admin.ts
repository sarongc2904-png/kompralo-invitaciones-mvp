import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseAdmin: SupabaseClient | null = null;

export type SupabaseOrder = {
  id: string;
  user_id: string;
  plan_slug: string;
  stripe_session_id: string | null;
  paid_at: string | null;
  created_at?: string | null;
};

export type SupabaseInvitation = {
  id: string;
  order_id: string;
  user_id: string;
  design_template: string | null;
  event_datetime: string | null;
  event_location: string | null;
  rsvp_enabled: boolean | null;
  whatsapp_number: string | null;
  gallery_urls: string[] | null;
  gift_table_url: string | null;
  dresscode_text: string | null;
  dresscode_color: string | null;
  map_url: string | null;
  custom_copy: string | null;
  visual_style: Record<string, unknown> | null;
  revision_notes: string | null;
  status: "draft" | "in_review" | "delivered";
  created_at?: string | null;
  updated_at?: string | null;
};

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase no esta configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.");
  }

  supabaseAdmin ??= createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return supabaseAdmin;
}
