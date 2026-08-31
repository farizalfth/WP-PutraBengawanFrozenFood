-- ============================================================
-- Migration 0002: Helper functions & triggers
-- ============================================================

-- ------------------------------------------------------------
-- Role helper functions (security definer, safe search_path)
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  );
$$;

create or replace function public.is_cashier()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'cashier'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or public.is_cashier();
$$;

-- ------------------------------------------------------------
-- Auto-create profile when a new auth user is registered
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'cashier')
  )
  on conflict (user_id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- Sync email on profile when auth user email changes
-- ------------------------------------------------------------
create or replace function public.handle_user_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
    set email = new.email
  where user_id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;

create trigger on_auth_user_updated
  after update of email on auth.users
  for each row
  execute procedure public.handle_user_update();