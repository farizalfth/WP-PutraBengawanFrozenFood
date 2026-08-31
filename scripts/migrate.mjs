import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import pg from 'pg'

const password = process.env.SUPABASE_DB_PASSWORD
if (!password) {
  console.error('Set SUPABASE_DB_PASSWORD dulu.')
  process.exit(1)
}

const client = new pg.Client({
  host: 'db.yjbjktsmahureijtjzlp.supabase.co',
  port: 5432,
  user: 'postgres',
  database: 'postgres',
  password,
  ssl: { rejectUnauthorized: false },
})

await client.connect()
console.log('terhubung ke database postgres ✓')

await client.query(`
  create table if not exists public.script_migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  )
`)

// Primer: kalau tabel sudah ada dari run sebelumnya tapi tracking kosong,
// tandai yang sudah diterapkan sesuai urutan.
const knownTables = await client.query(
  `select count(*)::int as n from information_schema.tables
   where table_schema='public' and table_name in
   ('categories','products','transactions','transaction_items','testimonials','profiles')`,
)
const told = await client.query('select count(*)::int as n from public.script_migrations')
if (told.rows[0].n === 0) {
  const applied = []
  if (knownTables.rows[0].n > 0) {
    applied.push('0001_schema.sql', '0002_functions.sql')
  }
  try {
    const p = await client.query(
      `select count(*)::int as n from pg_policies where schemaname='public'`,
    )
    if (p.rows[0].n > 0) applied.push('0003_rls.sql')
  } catch {}
  try {
    const b = await client.query(`select count(*)::int as n from storage.buckets`)
    if (b.rows[0].n > 0) applied.push('0004_storage.sql')
  } catch {}
  for (const name of applied) {
    await client.query(
      `insert into public.script_migrations(name) values($1) on conflict do nothing`,
      [name],
    )
  }
  console.log('tracking di-init. sudah ditandai:', applied.join(', ') || '(kosong)')
}

const dir = '/home/msi/Documents/VS Code/Frozen Food/supabase/migrations'
const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort()

const done = new Set(
  (await client.query(`select name from public.script_migrations`)).rows.map((r) => r.name),
)
const pending = files.filter((f) => !done.has(f))
console.log('menunggu diterapkan:', pending.join(', ') || '(tidak ada)')

for (const f of pending) {
  const sql = await readFile(join(dir, f), 'utf8')
  try {
    await client.query(sql)
    await client.query(`insert into public.script_migrations(name) values($1)`, [f])
    console.log(`✓ ${f}`)
  } catch (e) {
    console.error(`✗ ${f} GAGAL:\n${e.message}`)
    await client.end()
    process.exit(1)
  }
}

const tables = await client.query(
  `select table_name from information_schema.tables
   where table_schema='public' and table_type='BASE TABLE' order by 1`,
)
console.log('\ntabel di public:', tables.rows.map((r) => r.table_name).join(', '))

const buckets = await client.query(`select id from storage.buckets order by 1`)
console.log('storage buckets:', buckets.rows.map((r) => r.id).join(', '))

await client.end()
console.log('\nSELESAI — semua migration berhasil diterapkan')