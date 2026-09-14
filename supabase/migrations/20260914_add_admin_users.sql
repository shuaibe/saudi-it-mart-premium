-- Safe production migration: adds database-backed admin membership only.
-- It does not add any users or change existing website content.
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_users_user_id_idx on public.admin_users (user_id);
alter table public.admin_users enable row level security;

drop policy if exists "Admins can read their own membership" on public.admin_users;
create policy "Admins can read their own membership" on public.admin_users
  for select to authenticated using ((select auth.uid()) = user_id);

grant select on table public.admin_users to authenticated;
grant all on table public.admin_users to service_role;
revoke all on table public.admin_users from anon;
revoke insert, update, delete on table public.admin_users from authenticated;

drop trigger if exists admin_users_updated_at on public.admin_users;
create trigger admin_users_updated_at before update on public.admin_users for each row execute function public.touch_updated_at();