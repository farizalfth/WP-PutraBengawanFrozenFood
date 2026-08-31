-- ============================================================
-- Putra Bengawan Frozen Food - Database Schema
-- Migration 0001: Tables & indexes
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text not null default '',
  email       text,
  role        text not null default 'cashier'
              check (role in ('admin', 'cashier')),
  created_at  timestamptz not null default now(),
  constraint profiles_user_id_unique unique (user_id)
);

create index if not exists idx_profiles_role on public.profiles (role);

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- PRODUCTS
-- ------------------------------------------------------------
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  barcode        text not null,
  name           text not null,
  description    text,
  category_id    uuid references public.categories (id) on delete set null,
  price          integer not null default 0 check (price >= 0),
  stock          integer not null default 0 check (stock >= 0),
  image_url      text,
  is_best_seller boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint products_barcode_unique unique (barcode)
);

create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_barcode on public.products (barcode);
create index if not exists idx_products_best_seller on public.products (is_best_seller) where is_best_seller = true;

-- ------------------------------------------------------------
-- TRANSACTIONS
-- ------------------------------------------------------------
create table if not exists public.transactions (
  id             uuid primary key default gen_random_uuid(),
  invoice_number text not null,
  cashier_id     uuid not null references public.profiles (id) on delete restrict,
  total_amount   integer not null default 0 check (total_amount >= 0),
  payment_amount integer not null default 0 check (payment_amount >= 0),
  change_amount  integer not null default 0 check (change_amount >= 0),
  created_at     timestamptz not null default now(),
  constraint transactions_invoice_unique unique (invoice_number)
);

create index if not exists idx_transactions_cashier_id on public.transactions (cashier_id);
create index if not exists idx_transactions_created_at on public.transactions (created_at desc);

-- ------------------------------------------------------------
-- TRANSACTION ITEMS
-- ------------------------------------------------------------
create table if not exists public.transaction_items (
  id             uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions (id) on delete cascade,
  product_id     uuid not null references public.products (id) on delete restrict,
  quantity       integer not null check (quantity > 0),
  price          integer not null default 0,
  subtotal       integer not null default 0
);

create index if not exists idx_transaction_items_transaction_id on public.transaction_items (transaction_id);
create index if not exists idx_transaction_items_product_id on public.transaction_items (product_id);

-- ------------------------------------------------------------
-- TESTIMONIALS
-- ------------------------------------------------------------
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  job        text,
  message    text not null,
  rating     integer not null default 5 check (rating between 1 and 5),
  image_url  text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_testimonials_active on public.testimonials (is_active) where is_active = true;