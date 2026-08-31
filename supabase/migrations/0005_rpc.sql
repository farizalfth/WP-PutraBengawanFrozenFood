-- ============================================================
-- Migration 0005: RPC functions (transactions + dashboard)
-- ------------------------------------------------------------

-- ------------------------------------------------------------
-- create_transaction
-- Atomically inserts a transaction + items and reduces stock.
-- Only staff (admin/cashier) may call this via RLS.
-- ------------------------------------------------------------
create or replace function public.create_transaction(
  invoice_number text,
  cashier_id uuid,
  total_amount integer,
  payment_amount integer,
  change_amount integer,
  items jsonb
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_transaction_id uuid;
  v_item jsonb;
  v_product_id uuid;
  v_quantity integer;
  v_price integer;
  v_current_stock integer;
begin
  if not public.is_staff() then
    raise exception 'Anda tidak memiliki izin';
  end if;

  insert into public.transactions
    (invoice_number, cashier_id, total_amount, payment_amount, change_amount)
  values
    (invoice_number, cashier_id, total_amount, payment_amount, change_amount)
  returning id into v_transaction_id;

  for v_item in select * from jsonb_array_elements(items) loop
    v_product_id := (v_item ->> 'product_id')::uuid;
    v_quantity  := (v_item ->> 'quantity')::integer;
    v_price     := (v_item ->> 'price')::integer;

    -- Lock the product row to prevent race conditions
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
      (v_transaction_id, v_product_id, v_quantity, v_price, v_price * v_quantity);

    update public.products
      set stock = stock - v_quantity,
          updated_at = now()
      where id = v_product_id;
  end loop;

  return (
    select to_jsonb(t)
    from public.transactions t
    where t.id = v_transaction_id
  );
end;
$$;

-- ------------------------------------------------------------
-- get_dashboard_stats
-- Single call that returns all admin dashboard numbers.
-- ------------------------------------------------------------
create or replace function public.get_dashboard_stats()
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_result json;
begin
  if not public.is_staff() then
    raise exception 'Anda tidak memiliki izin';
  end if;

  select json_build_object(
    'totalProducts',
      (select count(*) from public.products),
    'totalCategories',
      (select count(*) from public.categories),
    'totalTransactions',
      (select count(*) from public.transactions),
    'todayRevenue',
      coalesce((
        select sum(total_amount)
        from public.transactions
        where created_at >= date_trunc('day', now())
      ), 0),
    'lowStockProducts',
      coalesce((
        select json_agg(json_build_object(
          'id', id,
          'name', name,
          'stock', stock,
          'image_url', image_url
        ))
        from public.products
        where stock <= 10
      ), '[]'::json),
    'recentTransactions',
      coalesce((
        select json_agg(json_build_object(
          'id', id,
          'invoice_number', invoice_number,
          'cashier_id', cashier_id,
          'total_amount', total_amount,
          'payment_amount', payment_amount,
          'change_amount', change_amount,
          'created_at', created_at
        ))
        from (
          select *
          from public.transactions
          order by created_at desc
          limit 5
        ) sub
      ), '[]'::json)
  ) into v_result;

  return v_result;
end;
$$;

-- ------------------------------------------------------------
-- RPC grants (must run after functions are created)
-- ------------------------------------------------------------
grant execute on function public.create_transaction to authenticated;
grant execute on function public.get_dashboard_stats to authenticated;