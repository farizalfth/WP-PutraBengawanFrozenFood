# Supabase Setup — Putra Bengawan Frozen Food

Project ini menggunakan Supabase (PostgreSQL) untuk semua data (produk, kategori,
testimoni, transaksi, otentikasi & role).

## 1. Buat project

1. Buka [supabase.com](https://supabase.com) → **New project**.
2. Salin nilai `Project URL` dan `anon public key` dari **Project Settings → API**.

## 2. Konfigurasi environment

```bash
cp .env.example .env
```

Isi:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

## 3. Jalankan migration

Di Supabase Dashboard → **SQL Editor**, jalankan file migration secara
berurutan:

| Urutan | File                              | Isi                          |
| ------ | --------------------------------- | ---------------------------- |
| 1      | `0001_schema.sql`                 | Tabel + index                |
| 2      | `0002_functions.sql`              | Helper role + trigger profil |
| 3      | `0003_rls.sql`                    | Row Level Security policies  |
| 4      | `0004_storage.sql`                | Bucket upload foto produk    |
| 5      | `0005_rpc.sql`                    | Fungsi transaksi + dashboard |
| 6      | `0006_seed.sql`                   | Kategori awal + panduan admin |

**Atau** jalankan seluruh file sekaligus (copy-paste sesuai urutan).

## 4. Buat user admin pertama

Jalankan di **SQL Editor** setelah user dibuat (atau ikuti panduan di
`0006_seed.sql`):

```sql
-- ganti dengan email admin Anda
update public.profiles
set role = 'admin', name = 'Administrator'
where email = 'admin@putrabengawan.id';
```

## 5. (Opsional) Toggle email confirmation

Untuk keperluan pengembangan, di **Authentication → Providers → Email**,
matikan *"Confirm email"* agar bisa langsung login tanpa verifikasi.

## 6. Role & hak akses (Ringkasan RLS)

| Action                  | Public | Admin | Cashier |
| ----------------------- | ------ | ----- | ------- |
| Baca produk/kategori    | ✔      | ✔     | ✔       |
| Baca testimoni aktif    | ✔      | ✔     | ✔       |
| CRUD produk/kategori    | –      | ✔     | –       |
| CRUD testimoni          | –      | ✔     | –       |
| Buat transaksi          | –      | ✔     | ✔       |
| Baca transaksi          | –      | ✔     | ✔       |
| Kelola user & role      | –      | ✔     | –       |

> RLS dijamin di sisi database. `service_role` **tidak pernah** dipakai di
> frontend; hanya `VITE_SUPABASE_ANON_KEY` yang digunakan.