create extension if not exists "pgcrypto";

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  hero_eyebrow text not null default '',
  hero_heading text not null default '',
  hero_description text not null default '',
  hero_features jsonb not null default '[]'::jsonb,
  hero_stat_badges jsonb not null default '[]'::jsonb,
  services_eyebrow text not null default '',
  services_heading text not null default '',
  about_eyebrow text not null default '',
  about_heading text not null default '',
  about_description text not null default '',
  about_expanded_description text not null default '',
  about_stats jsonb not null default '[]'::jsonb,
  brands_eyebrow text not null default '',
  brands_heading text not null default '',
  projects_eyebrow text not null default '',
  projects_heading text not null default '',
  clients_eyebrow text not null default '',
  clients_heading text not null default '',
  location_eyebrow text not null default '',
  location_heading text not null default '',
  location_description text not null default '',
  cta_heading text not null default '',
  cta_description text not null default '',
  footer_description text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  hero_image_asset_id uuid,
  about_image_asset_id uuid,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_settings (
  id boolean primary key default true check (id),
  whatsapp_number text not null default '',
  phone_number text not null default '',
  email text not null default '',
  office_address text not null default '',
  website_url text not null default '',
  facebook_url text not null default '',
  youtube_url text not null default '',
  instagram_url text not null default '',
  linkedin_url text not null default '',
  additional_links jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  asset_type text not null check (asset_type in ('hero', 'about', 'service', 'project', 'logo', 'other')),
  storage_path text not null unique,
  public_url text not null,
  alt_text text not null default '',
  mime_type text not null,
  file_size integer not null default 0,
  width integer,
  height integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  description text not null,
  detail text not null,
  serial text,
  tag text,
  image_asset_id uuid references public.media_assets(id) on delete restrict,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  location text not null,
  scope text not null,
  date_label text not null,
  badge text,
  detail text not null,
  image_asset_id uuid references public.media_assets(id) on delete restrict,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.logo_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_type text not null check (logo_type in ('main', 'partner', 'client')),
  storage_asset_id uuid not null references public.media_assets(id) on delete restrict,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  unique (logo_type, name),
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.contact_settings enable row level security;
alter table public.media_assets enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.logo_assets enable row level security;

create policy "Public can read site settings" on public.site_settings for select using (true);
create policy "Public can read contact settings" on public.contact_settings for select using (true);
create policy "Public can read media assets" on public.media_assets for select using (true);
create policy "Public can read services" on public.services for select using (is_visible);
create policy "Public can read projects" on public.projects for select using (is_visible);
create policy "Public can read logos" on public.logo_assets for select using (is_visible);

-- The application verifies ADMIN_EMAIL before every mutation. These policies allow
-- that authenticated session to perform the admin panel's writes and uploads.
create policy "Authenticated admins can insert site settings" on public.site_settings for insert to authenticated with check (true);
create policy "Authenticated admins can update site settings" on public.site_settings for update to authenticated using (true) with check (true);
create policy "Authenticated admins can insert contact settings" on public.contact_settings for insert to authenticated with check (true);
create policy "Authenticated admins can update contact settings" on public.contact_settings for update to authenticated using (true) with check (true);
create policy "Authenticated admins can insert media assets" on public.media_assets for insert to authenticated with check (true);
create policy "Authenticated admins can update media assets" on public.media_assets for update to authenticated using (true) with check (true);
create policy "Authenticated admins can update services" on public.services for update to authenticated using (true) with check (true);
create policy "Authenticated admins can update projects" on public.projects for update to authenticated using (true) with check (true);
create policy "Authenticated admins can update logos" on public.logo_assets for update to authenticated using (true) with check (true);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.touch_updated_at();
grant all on table public.logo_assets to service_role;

-- Server-side seed jobs use the secret/service-role key. Keep these grants
-- alongside RLS; service_role bypasses RLS but still requires table privileges.
grant all on table public.site_settings to service_role;
grant all on table public.contact_settings to service_role;
grant all on table public.media_assets to service_role;
grant all on table public.services to service_role;
grant all on table public.projects to service_role;
create trigger contact_settings_updated_at before update on public.contact_settings for each row execute function public.touch_updated_at();
-- Browser clients retain public reads only. Admin mutations are performed by
-- server actions after ADMIN_EMAIL verification using the service-role client.
revoke insert, update, delete on table public.site_settings from anon, authenticated;
revoke insert, update, delete on table public.contact_settings from anon, authenticated;
revoke insert, update, delete on table public.media_assets from anon, authenticated;
revoke insert, update, delete on table public.services from anon, authenticated;
revoke insert, update, delete on table public.projects from anon, authenticated;
revoke insert, update, delete on table public.logo_assets from anon, authenticated;
revoke insert, update, delete on table storage.objects from anon, authenticated;

create trigger media_assets_updated_at before update on public.media_assets for each row execute function public.touch_updated_at();
create trigger services_updated_at before update on public.services for each row execute function public.touch_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function public.touch_updated_at();
create trigger logo_assets_updated_at before update on public.logo_assets for each row execute function public.touch_updated_at();

insert into storage.buckets (id, name, public)
values ('website-media', 'website-media', true)
on conflict (id) do nothing;

create policy "Public can read website media" on storage.objects for select using (bucket_id = 'website-media');
create policy "Authenticated admins can upload website media" on storage.objects for insert to authenticated with check (bucket_id = 'website-media');
