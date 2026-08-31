# Putra Bengawan Frozen Food — Website + Admin + POS + Kasir

Website profesional untuk toko **Putra Bengawan Frozen Food** (Brebes, Jawa
Tengah). Dibangun dengan React, TypeScript, Vite, Tailwind CSS, React Router,
Supabase, Zustand, dan Lucide React. Siap di-deploy ke **Vercel**.

## Fitur

### Website Publik
- Homepage: hero, keunggulan layanan, produk best seller, kategori, tentang
  kami, testimoni, hubungi kami, footer.
- Halaman: `/`, `/tentang-kami`, `/produk`, `/produk/:id`,
  `/cara-order`, `/testimoni`, `/kontak`.
- Desain biru tua (royal blue) + putih dengan aksen snowflake, rounded card,
  dan responsif (desktop/tablet/mobile).

### Admin Dashboard (`/admin`)
- Login via Supabase Auth (`/admin/login`).
- Dashboard statistik: total produk, kategori, transaksi, pendapatan hari ini,
  produk stok menipis, transaksi terbaru.
- CRUD Produk (termasuk upload foto ke Supabase Storage, barcode, best seller).
- CRUD Kategori, Testimoni (dengan aktif/nonaktif).
- Lihat Transaksi (filter invoice/tanggal) + detail item.
- Kelola Pengguna (undang admin/kasir, ubah role, hapus).

### Kasir / POS (`/kasir`)
- Scan barcode USB (keyboard wedge, diakhiri Enter) maupun manual.
- Scan barcode via kamera (ZXing, opsional).
- Katalog produk dengan tombol tambah cepat.
- Keranjang: qty + / − , hapus, subtotal, total otomatis.
- Pembayaran: total, uang dibayar, kembalian otomatis.
- Transaksi atomik + pengurangan stok lewat RPC Supabase.
- Riwayat transaksi kasir (`/kasir/riwayat`) + cetak struk.

## Memulai

```bash
npm install
cp .env.example .env   # isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
npm run dev
```

```bash
npm run build   # typecheck + build produksi
npm run preview # pratinjau build
npm run lint    # oxlint
```

## Persyaratan Supabase

Jalankan migration di `supabase/migrations/` secara berurutan lewat SQL Editor
Supabase. Panduan lengkap: **`supabase/README.md`**.

- Tabel: `profiles`, `categories`, `products`, `transactions`,
  `transaction_items`, `testimonials`.
- RLS dijamin di sisi database:
  - **Public**: baca produk, kategori, testimoni aktif.
  - **Admin**: CRUD produk/kategori/testimoni, kelola user, lihat transaksi.
  - **Kasir**: baca produk/kategori, membuat transaksi & item.
- Storage bucket `product-images` untuk foto produk.
- RPC `create_transaction` (transaksi + stok atomik) dan `get_dashboard_stats`.

### Environment

| Variabel             | Keterangan                       |
| -------------------- | -------------------------------- |
| `VITE_SUPABASE_URL`  | Project URL Supabase             |
| `VITE_SUPABASE_ANON_KEY` | Anon/public key Supabase     |

> `service_role` key **tidak pernah** digunakan di frontend.

## Struktur Project

```
src/
├── components/   # public, admin, cashier, ui, shared
├── layouts/      # PublicLayout, AdminLayout, CashierLayout
├── pages/
│   ├── public/   # Home, Produk, Detail, Tentang, Cara Order, Testimoni, Kontak, 404
│   ├── admin/    # Login, Dashboard, Produk, Kategori, Transaksi, Testimoni, Pengguna
│   └── cashier/  # Kasir (POS), Riwayat
├── hooks/        # useAsyncData, useBarcodeScanner
├── stores/       # authStore, cartStore, toastStore (Zustand)
├── services/     # supabase, auth, produk, kategori, testimoni, transaksi, profil, storage
├── types/        # Domain types
├── utils/        # format, constants
└── lib/          # helpers
supabase/
└── migrations/   # SQL schema + RLS + RPC
```

## Deploy ke Vercel

1. Push repository ke GitHub.
2. Impor di [Vercel](https://vercel.com) — framework terdeteksi otomatis
   (Vite). `vercel.json` sudah menyertakan rewrite SPA agar React Router
   bekerja di semua route.
3. Tambahkan environment variables `VITE_SUPABASE_URL` dan
   `VITE_SUPABASE_ANON_KEY` di project settings Vercel.
4. Deploy :)

## Catatan Keamanan
- Semua keputusan izin divalidasi lewat **RLS** dan fungsi `security definer`
  di database, bukan hanya di frontend.
- Transaksi & pengurangan stok dilakukan dalam satu fungsi `create_transaction`
  yang mengunci baris produk (for update) agar tidak terjadi oversell.