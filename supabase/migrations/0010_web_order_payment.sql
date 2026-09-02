-- ============================================================
-- Migration 0010: Web order payment confirmation + sync
-- ------------------------------------------------------------
-- Adds payment-confirmation columns to web_orders, an RPC that
-- lets an anonymous customer confirm they have paid (TF/Cash/QRIS),
-- and an RPC for staff to sync a confirmed web order into the
-- `transactions` table (so it appears in /admin/transaksi).
-- This migration is idempotent and safe to re-run.
-- ------------------------------------------------------------

alter table public.web_orders
  add column if not exists payment_proof          text,
  add column if not exists payment_confirmed_at   timestamptz,
  add column if not exists synced_transaction_id  uuid;

-- ------------------------------------------------------------
-- confirm_web_order_payment
-- Called from the public order-success page by the customer.
-- Marks the web order as payment-confirmed; status moves
-- pending -> accepted. Idempotent (no-op if already confirmed).
-- ------------------------------------------------------------
create or replace function public.confirm_web_order_payment(
  p_order_id uuid,
  p_proof    text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.web_orders
    set payment_proof        = coalesce(p_proof, payment_proof),
        payment_confirmed_at = coalesce(payment_confirmed_at, now()),
        status               = case when status = 'pending' then 'accepted' else status end
    where id = p_order_id
      and payment_confirmed_at is null;
end;
$$;

grant execute on function public.confirm_web_order_payment to anon, authenticated;

-- ------------------------------------------------------------
-- sync_web_order_to_transactions
-- Staff-only. Turns a *confirmed* web order into a real cashier
-- transaction (inserts into transactions + transaction_items,
-- reduces product stock) and marks the web order as done.
-- Returns the new transaction id. Idempotent: refuses if the
-- web order was already synced.
-- ------------------------------------------------------------
create or replace function public.sync_web_order_to_transactions(
  p_order_id uuid
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_transaction_id uuid;
  v_web_order      record;
  v_item           record;
  v_cashier_id     uuid;
  v_product_id     uuid;
  v_quantity       integer;
  v_current_stock  integer;
begin
  if not public.is_staff() then
    raise exception 'Anda tidak memiliki izin';
  end if;

  select id, order_number, total_amount, synced_transaction_id
    into v_web_order
    from public.web_orders
    where id = p_order_id;

  if v_web_order.id is null then
    raise exception 'Pesanan tidak ditemukan';
  end if;

  if v_web_order.synced_transaction_id is not null then
    raise exception 'Pesanan sudah masuk ke transaksi';
  end if;

  -- Attach the transaction to the current staff member.
  select id into v_cashier_id
    from public.profiles
    where user_id = auth.uid()
    limit 1;

  if v_cashier_id is null then
    raise exception 'Profil kasir tidak ditemukan';
  end if;

  insert into public.transactions
    (invoice_number, cashier_id, total_amount, payment_amount, change_amount)
  values
    (v_web_order.order_number, v_cashier_id, v_web_order.total_amount,
     v_web_order.total_amount, 0)
  returning id into v_transaction_id;

  for v_item in
    select product_id, quantity, price
    from public.web_order_items
    where web_order_id = p_order_id
  loop
    v_product_id := v_item.product_id;
    v_quantity   := v_item.quantity;

    select stock
      into v_current_stock
      from public.products
      where id = v_product_id
      for update;

    if v_current_stock is null then
      raise exception 'Produk tidak ditemukan';
    end if;

    if v_current_stock < v_quantity then
      raise exception 'Stok produk tidak mencukupi';
    end if;

    insert into public.transaction_items
      (transaction_id, product_id, quantity, price, subtotal)
    values
      (v_transaction_id, v_product_id, v_quantity, v_item.price,
       v_item.price * v_quantity);

    update public.products
      set stock = stock - v_quantity,
          updated_at = now()
      where id = v_product_id;
  end loop;

  update public.web_orders
    set status = 'done',
        synced_transaction_id = v_transaction_id
    where id = p_order_id;

  return json_build_object(
    'transaction_id', v_transaction_id,
    'invoice_number', v_web_order.order_number
  );
end;
$$;

grant execute on function public.sync_web_order_to_transactions to authenticated;

-- ------------------------------------------------------------
-- Realtime: let the admin dashboard pick up new web orders live
-- ------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.web_orders;
exception when others then null;
end $$;