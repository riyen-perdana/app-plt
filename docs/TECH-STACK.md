# TECH-STACK — Rujukan Utama Keputusan Teknis

Dokumen ini adalah **sumber kebenaran** untuk teknologi, aturan, dan konvensi
di app `app-plt` (Aplikasi Pelatihan, UIN Suska Riau).

> **Aturan emas:** setiap penambahan fitur/modul WAJIB mengecek dokumen ini
> lebih dulu. Jika butuh teknologi yang belum terdaftar, **perbarui dokumen ini
> terlebih dahulu** (dan catat alasannya di bagian "Log Keputusan"), baru
> implementasi.

## 1. Stack Saat Ini

| Area | Teknologi | Versi (package.json) | Peran |
| --- | --- | --- | --- |
| Framework | TanStack Start (`@tanstack/react-start`) | latest | Full-stack framework, server functions |
| Routing | TanStack Router (`@tanstack/react-router`) | latest | File-based routing (`src/routes`), `routeTree.gen.ts` digenerate otomatis |
| UI library | React | ^19.3.0 | Rendering UI |
| Bahasa | TypeScript | ^6.0.2 | `strict`, `verbatimModuleSyntax`, alias `@/*` → `src/*` |
| Build tool | Vite | ^8 | Dev server (port 3000) & build; `@vitejs/plugin-react` ^6 |
| Styling | Tailwind CSS | ^4 (`@tailwindcss/vite`) | Utility-first; stylesheet `src/styles.css` |
| Komponen UI | shadcn + Radix UI (`radix-ui`) | shadcn ^4.21.4, radix-ui ^1.7.0 | Komponen di `src/components/ui` |
| Varian kelas | class-variance-authority, `cn` | ^0.7.1, ^0.4.0 | Varian komponen & penggabungan className (`src/lib/utils.ts`) |
| Animasi | tw-animate-css | ^1.4.0 | Animasi utilitas Tailwind |
| Ikon | lucide-react | ^1.54.0 | Ikon; ikon brand custom di `src/components/icons` |
| Font | @fontsource-variable/roboto | ^5.3.0 | Font aplikasi |
| Lint | ESLint + `@tanstack/eslint-config` | ^10 | `npm run lint` |
| Format | Prettier + prettier-plugin-tailwindcss | ^3.9.9 | tanpa semicolon, double quote, 2 spasi, width 80 |
| Devtools | TanStack Devtools / Router Devtools | latest | Hanya development |
| Form | TanStack Form (`@tanstack/react-form`) | ^1.33.5 | Seluruh state & submit form |
| Validasi | Zod (`zod`) | ^4.6.5 | Skema validasi tunggal untuk client & server |

## 2. Aturan Keputusan

1. **Form** → selalu TanStack Form. Jangan memakai `useState` per-input atau
   library form lain (react-hook-form, Formik).
2. **Validasi** → selalu skema Zod. Satu skema dipakai di client (validator
   form) **dan** server (server function) agar aturan tidak ganda.
3. **Data fetching & mutasi server** → TanStack Start server functions
   (`createServerFn`) + loader TanStack Router. Library data-fetching lain
   (mis. TanStack Query) hanya ditambahkan bila ada kebutuhan nyata, lewat
   pembaruan dokumen ini.
4. **Routing** → file-based di `src/routes`. Jangan edit `routeTree.gen.ts`
   manual.
5. **UI** → pakai komponen shadcn di `src/components/ui` lebih dulu. Tambah
   komponen baru lewat CLI shadcn, bukan menulis ulang dari nol. Styling hanya
   dengan Tailwind + `cn()`.
6. **Ikon** → lucide-react. Ikon brand yang tidak ada di lucide dibuat sebagai
   komponen di `src/components/icons`.
7. **Konstanta aplikasi** (nama app, institusi, dll.) → `src/lib/constant.ts`.
   Jangan hardcode di komponen.
8. **Dependensi baru** → harus dicatat di dokumen ini (area, peran, alasan)
   sebelum dipasang. Utamakan yang sudah ada di stack.

## 3. Konvensi

- **Bahasa UI & pesan error:** Bahasa Indonesia.
- **Import:** gunakan alias `@/...`, bukan path relatif panjang.
- **Struktur folder:**
  - `src/routes/_auth/*` — halaman publik/autentikasi (layout `_auth/route.tsx`)
  - `src/routes/_app/*` — halaman setelah login (layout `_app`)
  - `src/components/ui` — komponen shadcn
  - `src/components/icons` — ikon custom
  - `src/lib` — utilitas dan konstanta
  - `src/lib/schemas` — skema Zod per domain (mis. `auth.ts`)
- **Penamaan skema Zod:** skema (nilai) `xxxSchema` dengan camelCase, tipe
  hasilnya `XxxInput` dengan PascalCase. Contoh:
  `export const loginSchema = z.object({...})` dan
  `export type LoginInput = z.infer<typeof loginSchema>`.
- **Nama field form:** sama persis di skema Zod, `defaultValues`, dan atribut
  `name`/`id` input.
- **Format kode:** jalankan `npm run format`; cek `npm run check`,
  `npm run lint`, `npm run typecheck` sebelum commit.
- **Commit:** gaya Conventional Commits (`feat:`, `fix:`, `docs:`), seperti riwayat repo.

## 4. Log Keputusan

| Tanggal | Keputusan | Alasan |
| --- | --- | --- |
| 2026-10-11 | Tambah TanStack Form + Zod untuk form login dan seterusnya | Satu ekosistem TanStack, validasi type-safe dan bisa dipakai ulang di server |
| 2026-10-11 | Penamaan skema `xxxSchema` dan tipe `XxxInput`; skema di `src/lib/schemas` | Nama menjelaskan isi (aturan vs data) dan skema bisa dipakai bersama client dan server |
| 2026-10-11 | Dokumen ini ditetapkan sebagai rujukan utama | Menjaga konsistensi keputusan teknis saat fitur/modul bertambah |
