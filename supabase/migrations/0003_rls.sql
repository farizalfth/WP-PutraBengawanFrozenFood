-- ============================================================
-- Migration 0003: Row Level Security policies
-- ============================================================

-- ------------------------------------------------------------
-- Enable RLS on all tables
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_items enable row level security;
alter table public.testimonials enable row level security;

-- ------------------------------------------------------------
-- Grants
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated;

-- Public (anon) can read catalog + active testimonials
grant select on public.products, public.categories, public.testimonials to anon;

-- Authenticated users get full DML; RLS enforces row-level rules
grant select, insert, update, delete on
  public.profiles,
  public.categories,
  public.products,
  public.transactions,
  public.transaction_items,
  public.testimonials
  to authenticated;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_cashier() to authenticated;
grant execute on function public.is_staff() to anon, authenticated;

-- ------------------------------------------------------------
-- PRODUCTS
-- ------------------------------------------------------------
create policy "Products are public readable"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "Admins manage products"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
create policy "Categories are public readable"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Admins manage categories"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- TESTIMONIALS
-- ------------------------------------------------------------
create policy "Active testimonials are public readable"
  on public.testimonials for select
  to anon, authenticated
  using (is_active = true);

create policy "Staff can manage testimonials"
  on public.testimonials for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Staff can read all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_staff());

create policy "Admins manage profiles"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- TRANSACTIONS
-- ------------------------------------------------------------
create policy "Staff can read transactions"
  on public.transactions for select
  to authenticated
  using (public.is_staff());

create policy "Staff can create transactions"
  on public.transactions for insert
  to authenticated
  with check (public.is_staff());

create policy "Admins manage transactions"
  on public.transactions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete transactions"
  on public.transactions for delete
  to authenticated
  using (public.is_admin());

-- ------------------------------------------------------------
-- TRANSACTION ITEMS
-- ------------------------------------------------------------
create policy "Staff can read transaction items"
  on public.transaction_items for select
  to authenticated
  using (public.is_staff());

create policy "Staff can create transaction items"
  on public.transaction_items for insert
  to authenticated
  with check (public.is_staff());

create policy "Admins manage transaction items"
  on public.transaction_items for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete transaction items"
  on public.transaction_items for delete
  to authenticated
  using (public.is_admin());