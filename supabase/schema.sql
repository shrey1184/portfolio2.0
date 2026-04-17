-- Portfolio CMS schema for Supabase PostgreSQL
-- Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_config (
  id smallint primary key default 1 check (id = 1),
  admin_email text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tech_stack text[] not null default '{}',
  image_url text,
  is_published boolean not null default false,
  "order" integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  issuer text not null,
  achieved_at date,
  image_url text,
  is_published boolean not null default false,
  "order" integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  summary text not null,
  location text not null,
  start_date date not null,
  end_date date,
  image_url text,
  is_published boolean not null default false,
  "order" integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.layout_config (
  id smallint primary key default 1 check (id = 1),
  sections jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.theme_config (
  id smallint primary key default 1 check (id = 1),
  primary_color text not null,
  secondary_color text not null,
  tertiary_color text not null default '#777777',
  font_family text not null,
  hero_video_url text default '/globe.mp4',
  hero_image_url text default '/angel1.png',
  hero_video_opacity numeric default 0.5,
  blob_count integer not null default 10,
  blob_thickness integer not null default 1,
  blob_size integer not null default 80,
  blob_color text not null default '#FFFFFF',
  blob_speed integer not null default 4,
  updated_at timestamptz not null default now()
);

create index if not exists projects_order_idx on public.projects ("order");
create index if not exists achievements_order_idx on public.achievements ("order");
create index if not exists experience_order_idx on public.experience ("order");

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_admin_config on public.admin_config;
create trigger set_updated_at_admin_config
before update on public.admin_config
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_projects on public.projects;
create trigger set_updated_at_projects
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_achievements on public.achievements;
create trigger set_updated_at_achievements
before update on public.achievements
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_experience on public.experience;
create trigger set_updated_at_experience
before update on public.experience
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_layout_config on public.layout_config;
create trigger set_updated_at_layout_config
before update on public.layout_config
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_theme_config on public.theme_config;
create trigger set_updated_at_theme_config
before update on public.theme_config
for each row execute function public.set_updated_at();

create or replace function public.is_admin_email()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() ->> 'email') = (select admin_email from public.admin_config where id = 1),
    false
  );
$$;

revoke all on function public.is_admin_email() from public;
grant execute on function public.is_admin_email() to authenticated, anon;

alter table public.admin_config enable row level security;
alter table public.projects enable row level security;
alter table public.achievements enable row level security;
alter table public.experience enable row level security;
alter table public.layout_config enable row level security;
alter table public.theme_config enable row level security;

-- Admin config policies
drop policy if exists admin_config_select_admin on public.admin_config;
create policy admin_config_select_admin
on public.admin_config
for select
using (public.is_admin_email());

drop policy if exists admin_config_insert_admin on public.admin_config;
create policy admin_config_insert_admin
on public.admin_config
for insert
to authenticated
with check (public.is_admin_email());

drop policy if exists admin_config_update_admin on public.admin_config;
create policy admin_config_update_admin
on public.admin_config
for update
to authenticated
using (public.is_admin_email())
with check (public.is_admin_email());

-- Public + admin read policies for content
drop policy if exists projects_select_published on public.projects;
create policy projects_select_published
on public.projects
for select
using (is_published = true);

drop policy if exists projects_select_admin on public.projects;
create policy projects_select_admin
on public.projects
for select
using (public.is_admin_email());

drop policy if exists achievements_select_published on public.achievements;
create policy achievements_select_published
on public.achievements
for select
using (is_published = true);

drop policy if exists achievements_select_admin on public.achievements;
create policy achievements_select_admin
on public.achievements
for select
using (public.is_admin_email());

drop policy if exists experience_select_published on public.experience;
create policy experience_select_published
on public.experience
for select
using (is_published = true);

drop policy if exists experience_select_admin on public.experience;
create policy experience_select_admin
on public.experience
for select
using (public.is_admin_email());

-- Admin write policies for content
drop policy if exists projects_insert_admin on public.projects;
create policy projects_insert_admin
on public.projects
for insert
to authenticated
with check (public.is_admin_email());

drop policy if exists projects_update_admin on public.projects;
create policy projects_update_admin
on public.projects
for update
to authenticated
using (public.is_admin_email())
with check (public.is_admin_email());

drop policy if exists projects_delete_admin on public.projects;
create policy projects_delete_admin
on public.projects
for delete
to authenticated
using (public.is_admin_email());

drop policy if exists achievements_insert_admin on public.achievements;
create policy achievements_insert_admin
on public.achievements
for insert
to authenticated
with check (public.is_admin_email());

drop policy if exists achievements_update_admin on public.achievements;
create policy achievements_update_admin
on public.achievements
for update
to authenticated
using (public.is_admin_email())
with check (public.is_admin_email());

drop policy if exists achievements_delete_admin on public.achievements;
create policy achievements_delete_admin
on public.achievements
for delete
to authenticated
using (public.is_admin_email());

drop policy if exists experience_insert_admin on public.experience;
create policy experience_insert_admin
on public.experience
for insert
to authenticated
with check (public.is_admin_email());

drop policy if exists experience_update_admin on public.experience;
create policy experience_update_admin
on public.experience
for update
to authenticated
using (public.is_admin_email())
with check (public.is_admin_email());

drop policy if exists experience_delete_admin on public.experience;
create policy experience_delete_admin
on public.experience
for delete
to authenticated
using (public.is_admin_email());

-- Layout + theme read/write policies
drop policy if exists layout_select_public on public.layout_config;
create policy layout_select_public
on public.layout_config
for select
using (true);

drop policy if exists layout_insert_admin on public.layout_config;
create policy layout_insert_admin
on public.layout_config
for insert
to authenticated
with check (public.is_admin_email());

drop policy if exists layout_update_admin on public.layout_config;
create policy layout_update_admin
on public.layout_config
for update
to authenticated
using (public.is_admin_email())
with check (public.is_admin_email());

drop policy if exists theme_select_public on public.theme_config;
create policy theme_select_public
on public.theme_config
for select
using (true);

drop policy if exists theme_insert_admin on public.theme_config;
create policy theme_insert_admin
on public.theme_config
for insert
to authenticated
with check (public.is_admin_email());

drop policy if exists theme_update_admin on public.theme_config;
create policy theme_update_admin
on public.theme_config
for update
to authenticated
using (public.is_admin_email())
with check (public.is_admin_email());

-- Seed required singleton rows.
insert into public.layout_config (id, sections)
values (1, '["hero", "projects", "achievements", "experience", "contact"]'::jsonb)
on conflict (id) do nothing;

insert into public.theme_config (id, primary_color, secondary_color, tertiary_color, font_family, hero_video_url, hero_image_url, hero_video_opacity, blob_count, blob_thickness, blob_size, blob_color, blob_speed)
values (1, '#0F766E', '#0F172A', '#777777', '''Manrope'', ''Segoe UI'', sans-serif', '/globe.mp4', '/angel1.png', 0.5, 10, 1, 80, '#FFFFFF', 4)
on conflict (id) do nothing;

-- REQUIRED: Set this to the same email as ADMIN_EMAIL in your app environment.
insert into public.admin_config (id, admin_email)
values (1, 'shreyshrivastava11@gmail.com')
on conflict (id) do update set admin_email = excluded.admin_email;

-- Supabase Storage setup
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public read portfolio assets" on storage.objects;
create policy "Public read portfolio assets"
on storage.objects
for select
using (bucket_id = 'portfolio-assets');

drop policy if exists "Admin upload portfolio assets" on storage.objects;
create policy "Admin upload portfolio assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio-assets' and public.is_admin_email());

drop policy if exists "Admin update portfolio assets" on storage.objects;
create policy "Admin update portfolio assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio-assets' and public.is_admin_email())
with check (bucket_id = 'portfolio-assets' and public.is_admin_email());

drop policy if exists "Admin delete portfolio assets" on storage.objects;
create policy "Admin delete portfolio assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio-assets' and public.is_admin_email());
