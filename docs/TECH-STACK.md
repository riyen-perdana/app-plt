# TECH-STACK — Rujukan Utama Keputusan Teknis

Dokumen ini adalah **sumber kebenaran** untuk teknologi, aturan, dan konvensi
di app `app-plt` (Aplikasi Pelatihan, UIN Suska Riau).

> **Aturan emas:** setiap penambahan fitur/modul WAJIB mengecek dokumen ini
> lebih dulu. Jika butuh teknologi yang belum terdaftar, **perbarui dokumen ini
> terlebih dahulu** (dan catat alasannya di bagian "Log Keputusan"), baru
> implementasi.
>
> Pembagian dokumen: TECH-STACK = *apa* yang dipakai, `ARCHITECTURE.md` = *di
> mana* kode ditata, `ROADMAP.md` = *urutan* pengerjaan, `step.md` = catatan
> belajar. Cek ketiganya sebelum mengerjakan fitur.

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
| State UI client | Zustand (`zustand`) | ^5.0.15 | State sisi client yang dibagi lintas komponen (mulai dari tema light/dark/system); `persist` ke `localStorage` |
| Toast / notifikasi | Sonner (`sonner`) | ^2.0.8 | Umpan balik hasil mutasi lewat `toast.error(...)`/`toast.success(...)`. `Toaster` berasal dari komponen shadcn `ui/sonner`, temanya mengikuti store Zustand lewat `AppToaster` |

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
9. **State UI sisi client** → state yang dibagi lintas komponen dan murni milik
   browser (tema, panel terbuka, dll.) memakai Zustand, satu store per fitur di
   `src/features/<domain>/store.ts`. Data dari server tetap lewat loader/server
   function (aturan 3), state form tetap TanStack Form (aturan 1), dan state
   lokal satu komponen cukup `useState`. Jangan menaruh data server di Zustand.

## 3. Konvensi

- **Bahasa UI & pesan error:** Bahasa Indonesia.
- **Import:** gunakan alias `@/...`, bukan path relatif panjang.
- **Struktur folder:** lihat `ARCHITECTURE.md` (satu-satunya rujukan tata
  letak kode). Urutan pengerjaan fitur ada di `ROADMAP.md`.
- **Penamaan skema Zod:** skema (nilai) `xxxSchema` dengan camelCase, tipe
  hasilnya `XxxInput` dengan PascalCase. Contoh:
  `export const loginSchema = z.object({...})` dan
  `export type LoginInput = z.infer<typeof loginSchema>`.
- **Nama field form:** sama persis di skema Zod, `defaultValues`, dan atribut
  `name`/`id` input.
- **Umpan balik hasil mutasi:** berhasil atau gagal memanggil server →
  `toast` dari `sonner` (impor langsung, tanpa helper tambahan). Error validasi
  per field tetap ditampilkan dengan `FieldError`, bukan toast.
- **Format kode:** jalankan `npm run format`; cek `npm run check`,
  `npm run lint`, `npm run typecheck` sebelum commit.
- **Commit:** gaya Conventional Commits (`feat:`, `fix:`, `docs:`), seperti riwayat repo.
- **Environment:** semua variabel dideklarasikan dan divalidasi di
  `src/lib/env.server.ts` (skema Zod), dibaca dari server saja. Jangan memakai
  `process.env` langsung di tempat lain. Variabel yang boleh terlihat di
  browser harus berawalan `VITE_` dan tidak boleh berisi rahasia. Setiap
  variabel baru ditambahkan ke skema **dan** `.env.example`. Nilai asli ada di
  `.env` (di-ignore git); `.env.example` di-commit sebagai contoh.

## 4. Log Keputusan

| Tanggal | Keputusan | Alasan |
| --- | --- | --- |
| 2026-10-11 | Tambah TanStack Form + Zod untuk form login dan seterusnya | Satu ekosistem TanStack, validasi type-safe dan bisa dipakai ulang di server |
| 2026-10-11 | Penamaan skema `xxxSchema` dan tipe `XxxInput`; skema di `src/lib/schemas` | Nama menjelaskan isi (aturan vs data) dan skema bisa dipakai bersama client dan server |
| 2026-10-11 | Dokumen ini ditetapkan sebagai rujukan utama | Menjaga konsistensi keputusan teknis saat fitur/modul bertambah |
| 2026-10-11 | Struktur folder dipindah ke `ARCHITECTURE.md` (feature-based, skema di `features/<domain>/schemas`); urutan kerja di `ROADMAP.md` | Satu topik satu dokumen, menghindari konflik antar dokumen |
| 2026-10-23 | Tambah Zustand ^5.0.15 untuk state UI client, dimulai dari tema dark mode (light/dark/system, disimpan di `localStorage`); aturan 9 | Store kecil tanpa provider, middleware `persist` bawaan, cocok untuk state UI yang dibagi lintas komponen. Spec: `docs/superpowers/specs/2026-10-23-theme-dark-mode-design.md` |
| 2026-10-27 | Validasi environment dengan Zod di `src/lib/env.server.ts`, dibaca di tingkat modul (`export const env = parseEnv()`); `.env` di-ignore, `.env.example` di-commit (pengecualian `!.env.example` di `.gitignore`) | Gagal cepat dengan pesan jelas bila konfigurasi salah. Dokumen resmi TanStack Start menyebut parse tingkat modul "fine for Node.js", tetapi menyarankan baca per permintaan di runtime edge. **Perlu dikoreksi bila:** (1) target deploy (C4) ternyata edge, ubah ke fungsi `getEnv()` yang dipanggil dari handler; (2) `process.env` ternyata tidak terisi dari `.env` di server (belum terbukti, lihat `step.md`); (3) memilih mengikuti dokumen resmi (`.env` di-commit, rahasia di `.env.local`) |
| 2026-10-27 | Tambah `.gitattributes` (`* text=auto eol=lf`) | Di Windows dengan `core.autocrlf=true`, checkout menghasilkan CRLF sehingga `npm run check` (Prettier `endOfLine: lf`) gagal. Repo sudah LF; atribut ini memaksa LF di semua mesin tanpa mengubah setelan git global |
| 2026-10-27 | Tambah Sonner untuk toast, dipasang lewat CLI shadcn (`npx shadcn@latest add sonner`); `ui/sonner.tsx` dilepas dari `next-themes` dan menerima `theme` lewat props; `AppToaster` di `features/theme` membaca `useThemeStore` | Komponen shadcn resmi (aturan 5). Tema sudah punya satu sumber kebenaran di Zustand (aturan 9), jadi tidak perlu `next-themes`; `components/` tidak boleh mengimpor dari `features/`, maka pembungkus yang sadar tema ditaruh di `features/theme`. Spec: `docs/superpowers/specs/2026-10-27-error-handling-design.md`. CLI turut memasang `next-themes` (^0.4.6) yang hanya dipakai `ui/sonner.tsx`; dilepas lagi dengan `npm uninstall next-themes` setelah `ui/sonner.tsx` disesuaikan. **Perlu dikoreksi bila:** `next-themes` ternyata masih dipakai tempat lain |
