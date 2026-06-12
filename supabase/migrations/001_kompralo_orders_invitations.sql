create extension if not exists "pgcrypto";

do $$ begin
  create type invitation_status as enum ('draft', 'in_review', 'delivered');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  plan_slug text not null check (plan_slug in ('esencial', 'completo', 'premium')),
  stripe_session_id text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  user_id text not null,
  design_template text,
  event_datetime timestamptz,
  event_location text,
  rsvp_enabled boolean default true,
  whatsapp_number text,
  gallery_urls text[] default '{}',
  gift_table_url text,
  dresscode_text text,
  dresscode_color text,
  map_url text,
  custom_copy text,
  visual_style jsonb default '{}'::jsonb,
  revision_notes text,
  status invitation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists invitations_user_id_idx on public.invitations(user_id);

alter table public.orders enable row level security;
alter table public.invitations enable row level security;

do $$ begin
  create policy "service_role_orders" on public.orders
    for all using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create policy "service_role_invitations" on public.invitations
    for all using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');
exception
  when duplicate_object then null;
end $$;
