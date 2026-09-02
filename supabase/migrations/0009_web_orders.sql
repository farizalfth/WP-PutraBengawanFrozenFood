-- ============================================================
-- Migration 0009: Web orders (online store)
-- ------------------------------------------------------------
-- Online orders from the public website are stored in their own
-- table (web_orders) so anon visitors can place orders without a
-- staff cashier_id (unlike POS `transactions`).
-- This migration is idempotent and safe to re-run.
-- ------------------------------------------------------------

create table if not exists public.web_orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null,
  customer_name  text not null,
  customer_phone text not null,
  address        text not null default '',
  titik_lokasi   text,
  notes          text,
  delivery       text not null default 'pickup',
  payment        text not null default 'qris',
  total_amount   integer not null default 0 check (total_amount >= 0),
  status         text not null default 'pending',
  created_at     timestamptz not null default now(),
  constraint web_orders_order_number_unique unique (order_number)
);

create table if not exists public.web_order_items (
  id         uuid primary key default gen_random_uuid(),
  web_order_id uuid not null references public.web_orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  name       text not null,
  quantity   integer not null check (quantity > 0),
  price      integer not null default 0,
  subtotal   integer not null default 0
);

create index if not exists idx_web_orders_created_at on public.web_orders (created_at desc);
create index if not exists idx_web_order_items_web_order_id on public.web_order_items (web_order_id);
create index if not exists idx_web_order_items_product_id on public.web_order_items (product_id);

-- ------------------------------------------------------------
-- Anon/authenticated can insert orders (no staff check)
-- ------------------------------------------------------------
alter table public.web_orders enable row level security;
alter table public.web_order_items enable row level security;

grant select, insert, update on
  public.web_orders,
  public.web_order_items
  to anon, authenticated;

-- ------------------------------------------------------------
-- Idempotent policy setup
-- ------------------------------------------------------------
drop policy if exists "Anyone can create web orders" on public.web_orders;
drop policy if exists "Staff can read web orders" on public.web_orders;
drop policy if exists "Staff can manage web orders" on public.web_orders;
drop policy if exists "Admins can delete web orders" on public.web_orders;
drop policy if exists "Anyone can create web order items" on public.web_order_items;
drop policy if exists "Staff can read web order items" on public.web_order_items;
drop policy if exists "Admins can delete web order items" on public.web_order_items;

create policy "Anyone can create web orders"
  on public.web_orders for insert
  to anon, authenticated
  with check (true);

create policy "Staff can read web orders"
  on public.web_orders for select
  to anon, authenticated
  using (public.is_staff() or auth.role() = 'anon');

create policy "Staff can manage web orders"
  on public.web_orders for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Admins can delete web orders"
  on public.web_orders for delete
  to authenticated
  using (public.is_admin());

create policy "Anyone can create web order items"
  on public.web_order_items for insert
  to anon, authenticated
  with check (true);

create policy "Staff can read web order items"
  on public.web_order_items for select
  to anon, authenticated
  using (public.is_staff() or auth.role() = 'anon');

create policy "Admins can delete web order items"
  on public.web_order_items for delete
  to authenticated
  using (public.is_admin());

-- ------------------------------------------------------------
-- create_web_order: atomically insert order + items
-- ------------------------------------------------------------
create or replace function public.create_web_order(
  p_order_number text,
  p_customer_name text,
  p_customer_phone text,
  p_address text,
  p_titik_lokasi text,
  p_notes text,
  p_delivery text,
  p_payment text,
  p_total_amount integer,
  p_items jsonb
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_item jsonb;
begin
  insert into public.web_orders
    (order_number, customer_name, customer_phone, address, titik_lokasi,
     notes, delivery, payment, total_amount, status)
  values
    (p_order_number, p_customer_name, p_customer_phone, p_address,
     p_titik_lokasi, p_notes, p_delivery, p_payment, p_total_amount, 'pending')
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    insert into public.web_order_items
      (web_order_id, product_id, name, quantity, price, subtotal)
    values (
      v_order_id,
      (v_item ->> 'product_id')::uuid,
      v_item ->> 'name',
      (v_item ->> 'quantity')::integer,
      (v_item ->> 'price')::integer,
      (v_item ->> 'subtotal')::integer
    );
  end loop;

  return (
    select to_jsonb(o)
    from public.web_orders o
    where o.id = v_order_id
  );
end;
$$;

grant execute on function public.create_web_order to anon, authenticated;