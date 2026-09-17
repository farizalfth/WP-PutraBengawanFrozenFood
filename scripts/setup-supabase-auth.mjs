import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Script pengaturan otomatis Supabase Auth untuk fitur reset password.
 *
 * Yang dilakukan:
 *  - Mengatur Site URL dan Redirect URL (uri_allow_list) agar link reset dari
 *    email mengarah ke halaman /admin/reset-password.
 *  - (Opsional) Mengatur SMTP kustom supaya email verifikasi terkirim andal
 *    (mis. ke Gmail), jika variabel SMTP_* diisi.
 *
 * Pakai:
 *   SUPABASE_ACCESS_TOKEN=sbp_xxx npm run setup:auth
 *
 * Variabel opsional:
 *   SUPABASE_PROJECT_REF   (default: dibaca dari .env VITE_SUPABASE_URL)
 *   SITE_URL               (default: https://putrabengawanfrozenfood.vercel.app)
 *   EXTRA_REDIRECT_URLS    URL tambahan, dipisah koma
 *   SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS SMTP_SENDER_EMAIL SMTP_SENDER_NAME
 */

const token = process.env.SUPABASE_ACCESS_TOKEN
if (!token) {
  console.error(
    'Set SUPABASE_ACCESS_TOKEN dulu.\n' +
      'Buat di: https://supabase.com/dashboard/account/tokens',
  )
  process.exit(1)
}

async function readEnv(key) {
  try {
    const raw = await readFile(join(process.cwd(), '.env'), 'utf8')
    const match = raw.match(new RegExp(`^${key}=(.*)$`, 'm'))
    return match?.[1]?.trim() ?? null
  } catch {
    return null
  }
}

function projectRefFromUrl(url) {
  if (!url) return null
  const m = url.match(/https:\/\/([^.]+)\.supabase\.co/)
  return m?.[1] ?? null
}

const siteUrl =
  process.env.SITE_URL || 'https://putrabengawanfrozenfood.vercel.app'

const projectRef =
  process.env.SUPABASE_PROJECT_REF ||
  projectRefFromUrl(await readEnv('VITE_SUPABASE_URL'))

if (!projectRef) {
  console.error(
    'Tidak menemukan project ref. Set SUPABASE_PROJECT_REF=xxxx di environment.',
  )
  process.exit(1)
}

const apiBase = `https://api.supabase.com/v1/projects/${projectRef}/config/auth`
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

const wantedRedirects = [
  `${siteUrl}/admin/reset-password`,
  'http://localhost:5173/admin/reset-password',
  ...(process.env.EXTRA_REDIRECT_URLS
    ? process.env.EXTRA_REDIRECT_URLS.split(',').map((s) => s.trim())
    : []),
].filter(Boolean)

console.log(`Project ref : ${projectRef}`)
console.log(`Site URL    : ${siteUrl}`)
console.log(`Redirect    : ${wantedRedirects.join(', ')}`)

const getRes = await fetch(apiBase, { headers })
if (!getRes.ok) {
  console.error(`Gagal membaca config auth (${getRes.status}):`, await getRes.text())
  process.exit(1)
}
const current = await getRes.json()

const existing = (current.uri_allow_list ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const merged = Array.from(new Set([...existing, ...wantedRedirects]))

const payload = {
  site_url: siteUrl,
  uri_allow_list: merged.join(','),
}

const smtpKeys = {
  SMTP_HOST: 'smtp_host',
  SMTP_PORT: 'smtp_port',
  SMTP_USER: 'smtp_user',
  SMTP_PASS: 'smtp_pass',
  SMTP_SENDER_EMAIL: 'smtp_admin_email',
  SMTP_SENDER_NAME: 'smtp_sender_name',
}
let smtpConfigured = false
for (const [envKey, apiKey] of Object.entries(smtpKeys)) {
  const value = process.env[envKey]
  if (value) {
    payload[apiKey] = value
    smtpConfigured = true
  }
}

const patchRes = await fetch(apiBase, {
  method: 'PATCH',
  headers,
  body: JSON.stringify(payload),
})

if (!patchRes.ok) {
  console.error(
    `Gagal menyimpan config (${patchRes.status}):`,
    await patchRes.text(),
  )
  process.exit(1)
}

console.log('\n✓ Site URL & Redirect URL berhasil disimpan.')
if (smtpConfigured) {
  console.log('✓ SMTP kustom berhasil disimpan.')
} else {
  console.log(
    '• SMTP tidak diubah (masih pakai bawaan Supabase). Isi SMTP_* untuk memakai email kustom.',
  )
}
console.log(
  '\nSelesai. Coba fitur "Lupa kata sandi?" di https://putrabengawanfrozenfood.vercel.app/admin/login',
)
