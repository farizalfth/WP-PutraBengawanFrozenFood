-- ============================================================
-- Migration 0007: Realtime aktivitas kasir & website
-- ------------------------------------------------------------

-- Realtime untuk tabel transaksi (transaksi kasir -> dashboard live)
do $$
begin
  alter publication supabase_realtime add table public.transactions;
exception when others then null;
end $$;

-- ------------------------------------------------------------
-- Tabel page_views untuk tracking pengunjung website
-- ------------------------------------------------------------
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text default null,
  user_agent text default null,
  created_at timestamptz not null default now()
);

alter table public.page_views enable row level security;

grant select on public.page_views to authenticated;

create policy "Staff can read page views"
  on public.page_views for select
  to authenticated
  using (public.is_staff());

-- Realtime untuk page_views (aktivitas web -> dashboard live)
do $$
begin
  alter publication supabase_realtime add table public.page_views;
exception when others then null;
end $$;

-- ------------------------------------------------------------
-- RPC: track_page_view — dipanggil anon dari halaman publik.
-- security definer + search_path kosong, hanya insert ringan.
-- ------------------------------------------------------------
create or replace function public.track_page_view(
  p_path text,
  p_referrer text default null,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.page_views (path, referrer, user_agent)
  values (left(p_path, 255), left(p_referrer, 500), left(p_user_agent, 500));
end;
$$;

grant execute on function public.track_page_view to anon, authenticated;

-- ------------------------------------------------------------
-- RPC: get_web_stats — statistik live untuk dashboard admin.
-- ------------------------------------------------------------
create or replace function public.get_web_stats()
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
    'today',
      count(*) filter (where created_at >= date_trunc('day', now())),
    'total',
      count(*),
    'topPaths',
      coalesce((
        select json_agg(json_build_object('path', path, 'count', cnt))
        from (
          select path, count(*) as cnt
          from public.page_views
          group by path
          order by cnt desc
          limit 5
        ) p
      ), '[]'::json),
    'recent',
      coalesce((
        select json_agg(json_build_object(
          'id', id,
          'path', path,
          'created_at', created_at
        ))
        from (
          select *
          from public.page_views
          order by created_at desc
          limit 8
        ) sub
      ), '[]'::json)
  ) into v_result
  from public.page_views;

  return v_result;
end;
$$;

grant execute on function public.get_web_stats to authenticated;

-- ------------------------------------------------------------
-- RPC: delete_transaction — admin membatalkan transaksi.
-- Item dihapus dan stok produk dikembalikan otomatis.
-- ------------------------------------------------------------
create or replace function public.delete_transaction(p_transaction_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item record;
  v_cashier uuid;
begin
  if not public.is_admin() then
    raise exception 'Anda tidak memiliki izin';
  end if;

  select cashier_id into v_cashier
    from public.transactions
    where id = p_transaction_id;

  if v_cashier is null then
    raise exception 'Transaksi tidak ditemukan';
  end if;

  for v_item in
    select product_id, quantity
    from public.transaction_items
    where transaction_id = p_transaction_id
  loop
    update public.products
      set stock = stock + v_item.quantity,
          updated_at = now()
      where id = v_item.product_id;
  end loop;

  delete from public.transaction_items where transaction_id = p_transaction_id;
  delete from public.transactions where id = p_transaction_id;
end;
$$;

grant execute on function public.delete_transaction to authenticated;