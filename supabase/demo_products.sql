-- ============================================================
-- Demo data: produk contoh + testimoni (opsional, dapat diulang)
-- Dipakai untuk menguji dashboard admin & POS kasir.
-- ============================================================

insert into public.products (barcode, name, description, category_id, price, stock, is_best_seller)
select v.barcode, v.name, v.description, c.id, v.price, v.stock, v.is_best_seller
from (values
  ('8991005000101', 'Nugget Ayam Premium 500g', 'Nugget ayam pilihan, renyah di luar, lembut di dalam. Siap digoreng.', 'Nugget', 35000, 50, true),
  ('8991005000200', 'Nugget Crispy Jumbo 500g', 'Varian nugget crispy ukuran jumbo, cocok untuk lauk anak.', 'Nugget', 38000, 40, false),
  ('8991005000307', 'Sosis Sapi Premium 10 pcs', 'Sosis sapi 100% daging segar, 10 batang per kemasan.', 'Sosis', 28000, 60, true),
  ('8991005000404', 'Sosis Ayam Original 500g', 'Sosis ayam original untuk berbagai olahan masakan.', 'Sosis', 25000, 55, false),
  ('8991005000501', 'Bakso Sapi Kenyal 500g', 'Bakso sapi kenyal isi 15 butir, tanpa pengawet berlebih.', 'Bakso & Olahan', 42000, 45, true),
  ('8991005000608', 'Bakso Ayam 500g', 'Bakso ayam lembut, siap untuk bakso kuah atau goreng.', 'Bakso & Olahan', 35000, 35, false),
  ('8991005000705', 'Dimsum Ayam 1kg', 'Dimsum ayam isi 25 pcs, cocok untuk jualan atau stok rumah.', 'Siap Masak', 55000, 25, true),
  ('8991005000802', 'French Fries 1kg', 'Kentang goreng beku, cemilan favorit keluarga.', 'Siap Masak', 32000, 40, false),
  ('8991005000909', 'Sosis Bakar BBQ 500g', 'Sosis bakar rasa BBQ, tinggal panaskan di teflon.', 'Siap Masak', 29000, 30, false),
  ('8991005001006', 'Es Krim Vanilla 1L', 'Es krim vanilla lembut kemasan 1 liter.', 'Lainnya', 25000, 20, false),
  ('8991005001103', 'Tahu Crispy 500g', 'Tahu crispy siap goreng, stok camilan praktis.', 'Bakso & Olahan', 22000, 25, false),
  ('8991005001200', 'Sambal Goreng Kentang 500g', 'Sambal goreng kentang siap masak, tinggal panaskan.', 'Siap Masak', 27000, 30, false)
) as v(barcode, name, description, category, price, stock, is_best_seller)
join public.categories c on c.name = v.category
on conflict (barcode) do nothing;

insert into public.testimonials (name, job, message, rating, is_active)
select v.name, v.job, v.message, v.rating, true
from (values
  ('Siti Rahayu', 'Ibu Rumah Tangga',
   'Stok nugget dan sosisnya selalu segar. Anak-anak suka, langsung kirim ke rumah. Recommended!', 5),
  ('Budi Santoso', 'Pemilik Warung',
   'Sudah langganan restock dimsum dan french fries. Harga terjangkau dan pengiriman cepat.', 5),
  ('Dewi Lestari', 'Karyawan Swasta',
   'Bakso sapinya beneran kenyal, rasanya juara. Pasti pesan lagi.', 4)
) as v(name, job, message, rating)
on conflict do nothing;