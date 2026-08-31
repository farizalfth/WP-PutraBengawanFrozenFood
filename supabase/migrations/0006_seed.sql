-- ============================================================
-- Migration 0006: Seed data (re-runnable)
-- ============================================================

-- Default product categories
insert into public.categories (name, description)
values
  ('Nugget', 'Nugget ayam dan varian nugget siap masak'),
  ('Sosis', 'Sosis sapi dan ayam berbagai rasa'),
  ('Bakso & Olahan', 'Bakso serta olahan daging siap saji'),
  ('Siap Masak', 'Produk frozen food siap olah'),
  ('Lainnya', 'Produk frozen food lainnya')
on conflict do nothing;

-- ============================================================
-- MEMBUAT ADMIN PERTAMA:
-- ------------------------------------------------------------
-- 1. Buka Supabase Dashboard > Authentication > Users
-- 2. Klik "Add user" / "Invite user", isi email & password user admin.
--    Opsi A (disarankan): gunakan tombol "Invite user" lalu di kolom
--    "Metadata" isi: {"role":"admin","name":"Administrator"}
--    Opsi B: tambahkan user biasa, lalu jalankan query di SQL Editor:
--
--      update public.profiles
--      set role = 'admin', name = 'Administrator'
--      where email = '<email-admin@anda.com>';
--
-- 3. Login di halaman /admin/login dengan akun tersebut.
-- ============================================================