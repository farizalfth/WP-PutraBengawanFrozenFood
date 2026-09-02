-- ============================================================
-- Migration 0008: Tambah kategori produk frozen food
-- (idempotent - hanya menambah jika belum ada)
-- ============================================================

insert into public.categories (name, description)
select c.name, c.description
from (
  values
    ('Saus Mayones', 'Mayones dan saus pelengkap siap pakai'),
    ('Dimsum', 'Dimsum dan siomay siap kukus'),
    ('Kebab', 'Kebab cepat saji siap panaskan'),
    ('Kentang', 'Kentang goreng dan olahan kentang'),
    ('Olahan Ayam', 'Olahan ayam siap masak'),
    ('Olahan Ikan & Seafood', 'Olahan ikan, udang, dan seafood'),
    ('Cemilan & Kue', 'Cemilan beku dan kue siap saji')
) as c(name, description)
where not exists (
  select 1 from public.categories existing
  where existing.name = c.name
);