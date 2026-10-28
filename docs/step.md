# Catatan Belajar: TanStack Form + Zod pada Form Login

Catatan ini berisi langkah demi langkah dari sesi belajar, supaya bisa dibaca
ulang kapan saja. Rujukan teknis utama: [TECH-STACK.md](./TECH-STACK.md).

**Aturan sesi:** kode ditulis sendiri oleh pemilik proyek, pemandu hanya
menjelaskan dan mereview.

**Status:** Langkah 1–3 selesai. Langkah 4 sudah dijabarkan, belum dikerjakan. Langkah 5 belum dimulai.

---

## 2026-10-11

### Langkah 0: Persiapan
- Membuat [TECH-STACK.md](./TECH-STACK.md) sebagai rujukan keputusan teknis.
- Menyetujui TanStack Form + Zod sebagai stack form dan validasi.
- Form login (UI) sudah selesai di `src/routes/_auth/login.tsx`: field
  `identifier` dan `password`, toggle tampil/sembunyi password, saat ini
  `onSubmit` hanya `preventDefault()`.

### Langkah 1: Instal dependensi
Jalankan:

```bash
npm install @tanstack/react-form zod
```

Lalu pindahkan baris TanStack Form dan Zod dari bagian 2 ke bagian 1 di
TECH-STACK.md, lengkap dengan versi dari `package.json`.

- [x] Selesai (2026-10-11): terpasang `@tanstack/react-form` ^1.33.5 dan `zod` ^4.6.5.
  Peringatan "7 high severity vulnerabilities" dari npm audit berasal dari
  dependensi lain, bukan dari dua paket ini. Jangan jalankan `npm audit fix --force`
  tanpa mengecek dulu, karena bisa merusak versi paket.

### Langkah 2: Buat skema Zod
File: `src/lib/schemas/auth.ts` (buat folder `schemas`).

Yang perlu ada:
- `loginSchema = z.object({...})` dengan field `identifier` dan `password`.
  Nama field harus sama dengan atribut `name` di login.tsx.
- `identifier`: string, `.trim()`, wajib diisi. Pesan: "Nama pengguna wajib diisi".
- `password`: string, `.min(1, "...")`. Di login tidak ada aturan kekuatan
  password, karena server yang menentukan benar atau salah.
- Ekspor tipe: `export type LoginInput = z.infer<typeof loginSchema>`.
- Zod v4 menerima pesan error langsung sebagai string: `z.string().min(1, "pesan")`.

Pertanyaan renungan: kenapa skema ditaruh di `src/lib`, bukan di dalam file
route? (Jawaban: aturan keputusan nomor 2 di TECH-STACK.md, satu skema dipakai
di client dan server.)

- [x] Selesai, sudah direview (2026-10-11)
  - Hasil: `src/lib/schemas/auth.ts` berisi `loginSchema` (`username` di-trim, `password` tidak di-trim) dan tipe `LoginSchema`.
  - Keputusan: field bernama `username`. `id`/`name` di login.tsx sudah diganti dari `identifier` ke `username` agar cocok dengan skema.
  - Pelajaran: nama field di skema = nama field di form; password tidak boleh di-trim; skema ditaruh di `src/lib` karena dipakai bersama oleh client dan server.

### Langkah 3 (berikutnya): Hubungkan `useForm` ke form login
File: `src/routes/_auth/login.tsx` (edit, tidak buat file baru).

Tujuan: semua state input dan submit dikelola TanStack Form, bukan `useState`
per input. Error belum ditampilkan (itu langkah 4) dan submit belum memanggil
server (itu langkah 5).

Yang perlu dilakukan:
1. **Impor.** `useForm` dari `@tanstack/react-form` dan `loginSchema` dari
   `@/lib/schemas/auth`.
2. **Buat instance form** di dalam `LoginPage`:
   - `defaultValues: { username: "", password: "" }`. Nama field harus sama
     dengan skema dan atribut `name`/`id` input.
   - `validators: { onSubmit: loginSchema }`. Zod v4 mendukung Standard Schema,
     jadi skema bisa dipasang langsung tanpa adapter. Pakai `onSubmit` dulu
     (bukan `onChange`) supaya user tidak langsung diberi error saat mengetik.
   - `onSubmit: async ({ value }) => {}`. Isi dulu `console.log(value)`;
     panggilan server baru di langkah 5.
3. **Ganti handler form.** Di `<form onSubmit>`, ganti `event.preventDefault()`
   saja menjadi: `event.preventDefault()`, `event.stopPropagation()`, lalu
   `form.handleSubmit()`. `preventDefault` tetap wajib (lihat commit
   "prevent native submit on login form").
4. **Bungkus tiap input dengan `<form.Field name="...">`.** Child-nya adalah
   render prop `(field) => ...`. Di dalamnya, sambungkan input:
   - `value={field.state.value}`
   - `onChange={(e) => field.handleChange(e.target.value)}`
   - `onBlur={field.handleBlur}`
   - `id`/`name` tetap `field.name` atau string yang sama.
   Lakukan untuk `Input` (username) dan `InputGroupInput` (password).
   `useState` untuk `showPassword` tetap dipertahankan, itu state UI, bukan
   state form.
5. **Uji.** Isi form lalu klik Masuk: konsol harus menampilkan
   `{ username, password }`. Kosongkan field lalu submit: `onSubmit` tidak
   boleh terpanggil (validasi Zod menahannya).

Jebakan umum:
- `name` di `<form.Field>` salah ketik: TypeScript akan protes karena tipenya
  diturunkan dari `defaultValues`. Itu fitur, bukan gangguan.
- Lupa `onBlur`: status `isTouched` field tidak akan terisi.
- Lupa `form.handleSubmit()`: submit tidak berbuat apa-apa dan tidak ada error.

Pertanyaan renungan: kenapa `defaultValues` wajib diisi string kosong, bukan
dibiarkan `undefined`? (Petunjuk: input terkontrol vs tak terkontrol.)

- [x] Selesai (2026-10-11): `useForm`, `<form.Field>` untuk username dan password,
  dan `form.handleSubmit()` sudah terpasang di login.tsx. Type-check lolos.
  - Catatan: saat field kosong, `console.log` memang tidak keluar, karena
    validasi Zod gagal sehingga `onSubmit` tidak dipanggil.
  - Pelajaran: `<form onSubmit={form.handleSubmit}>` saja tidak cukup, tetap
    perlu `preventDefault()` agar browser tidak memuat ulang halaman.

### Langkah 4: Tampilkan error per field dan state submit
File: `src/routes/_auth/login.tsx`.

Tujuan: user melihat pesan Zod di bawah field yang salah, dan tombol Masuk
menunjukkan status saat submit berjalan.

1. **Impor `FieldError`** dari `@/components/ui/field` (sudah ada di proyek,
   menerima prop `errors`).
2. **Di dalam tiap `<form.Field>`**, hitung status invalid:
   `const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid`.
   `isTouched` ikut terisi saat submit, jadi error muncul setelah klik Masuk.
3. **Tandai invalid.** Beri `data-invalid={isInvalid}` pada `<Field>` dan
   `aria-invalid={isInvalid}` pada input (untuk password, pada `InputGroupInput`).
4. **Tampilkan pesan** setelah input:
   `{isInvalid && <FieldError errors={field.state.meta.errors} />}`.
   Untuk password, letakkan setelah `</InputGroup>`.
5. **State submit.** Pakai `<form.Subscribe selector={(s) => s.isSubmitting}>`
   untuk membungkus tombol Masuk: `disabled={isSubmitting}` dan teks
   "Memproses..." saat true.

Pertanyaan renungan: kenapa memakai `form.Subscribe`, bukan membaca
`form.state` langsung di komponen? (Petunjuk: re-render.)

- [~] Sebagian: butir 1-4 selesai (lihat "Perbaikan setelah refactor"), butir 5 belum.

### Refactor A1 (ROADMAP): login ke struktur feature-based
Dikerjakan setelah Langkah 3, mengikuti [ARCHITECTURE.md](./ARCHITECTURE.md).
Catatan: path pada Langkah 2 dan 3 di atas adalah kondisi saat itu; sekarang
sudah pindah.

- [x] Selesai (2026-10-11)
  - Skema dipindah: `src/lib/schemas/auth.ts` menjadi
    `src/features/auth/schemas/auth.ts`.
  - Form dipindah ke `src/features/auth/components/login-form.tsx`
    (`LoginForm`: `useForm`, `showPassword`, blok `<form>`).
  - `src/routes/_auth/login.tsx` menjadi tipis: hanya route + `LoginPage`
    yang merangkai `Logo`, judul, `LoginForm`, dan tombol Google.
  - Pelajaran: route tipis, logika dan UI fitur tinggal di `features/<domain>`.

### Perbaikan setelah refactor
- [x] `FieldError` ditampilkan per field (Langkah 4 butir 1-4: `isInvalid`,
  `data-invalid`, `aria-invalid`, pesan Zod). Dikerjakan oleh pemandu atas
  permintaan pemilik proyek.
- [x] Tombol mata password diberi `type="button"`.
- [ ] Langkah 4 butir 5 (`form.Subscribe` untuk state submit) belum dikerjakan.

### Langkah 5: Tangani submit
Akan diisi.

### Fitur Lupa Kata Sandi (tampilan saja)
Rencana: [rencana-lupa-password.md](./rencana-lupa-password.md).

- [x] Selesai (2026-10-11)
  - Route tipis `src/routes/_auth/forgot-password.tsx`: Logo, judul,
    penjelasan, `ForgotPasswordForm`.
  - Form `src/features/auth/components/forgot-password-form.tsx`: satu field
    email (`TextField` dari `useAppForm`) + tombol "Kirim" + tautan kembali
    ke `/login`.
  - `forgotPasswordSchema` ditambahkan di `src/features/auth/schemas/auth.ts`
    (email wajib diisi dan valid). Ini tambahan di luar rencana awal.
  - Tautan "Lupa Kata Sandi?" di `login-form.tsx` diganti menjadi `Link` ke
    `/forgot-password`.
  - `onSubmit` masih `console.log(value)`, sengaja disamakan dengan login;
    keduanya diganti di Langkah 5.
  - Lolos `typecheck`, `lint`, `check`, dan sudah dicek manual di browser.
  - Pelajaran: fitur baru cukup menyalin pola login (route tipis + form di
    `features/auth`), `TextField` dipakai ulang tanpa perubahan.

### Fitur Tema Dark Mode (Zustand)
Spec: [2026-10-23-theme-dark-mode-design.md](./superpowers/specs/2026-10-23-theme-dark-mode-design.md).
Rencana: [2026-10-23-theme-dark-mode.md](./superpowers/plans/2026-10-23-theme-dark-mode.md).

- [x] Selesai (2026-10-23)
  - Task 1, fondasi state: Zustand ^5.0.15 dicatat di `TECH-STACK.md` lalu
    dipasang; `THEME_STORAGE_KEY` di `lib/constant.ts`; `types.ts`
    (`THEMES`, `Theme`, `isTheme`), `apply-theme.ts`, dan `store.ts` di
    `src/features/theme/`.
  - Task 2, penerapan ke halaman: `ThemeSync` (efek client yang menerapkan
    tema dan memantau preferensi OS), `themeScript` (skrip inline di
    `head().scripts`), dipasang di `routes/__root.tsx`.
  - Task 3, tombol: `ThemeToggle` (dropdown shadcn dengan radio Terang/Gelap/
    Sistem) dipasang di layout `routes/_auth/route.tsx`.
  - Lolos `typecheck`, `lint`, `check`.
  - Pelajaran:
    - `create<State>()(persist(...))` memakai tanda kurung ganda agar tipe
      middleware terbaca TypeScript. `partialize` membatasi apa yang disimpan,
      `merge` menolak nilai rusak lewat `isTheme`.
    - Zustand `persist` hanya terbaca setelah React hidrasi, sehingga halaman
      bisa berkedip. Skrip inline sinkron di `<head>` memasang class `dark`
      sebelum render untuk mencegahnya.
    - Ikon matahari/bulan ditukar lewat CSS (`dark:hidden`, `hidden dark:block`),
      bukan kondisi JS, agar HTML server dan client sama (tanpa hydration
      mismatch).
    - Type guard (`value is Theme`) dipakai untuk menyempitkan `string` dari
      `onValueChange` menjadi `Theme` tanpa `as`.

### Validasi Environment dengan Zod (A2)

- [x] Selesai (2026-10-27)
  - `src/lib/env.server.ts`: skema Zod (`NODE_ENV`, `APP_URL`), `parseEnv()`
    membaca `process.env` dan melempar galat `Konfigurasi environment tidak
    valid` berisi daftar variabel yang salah. `Env` diturunkan dari skema.
  - `.env.example` (di-commit) dan `.env` (di-ignore) di root. `.gitignore`
    mengabaikan `.env*`, jadi ditambah pengecualian `!.env.example`.
  - Lolos `typecheck`, `lint`, `check`. Validasi dicoba terpisah lewat Node:
    `APP_URL` benar lolos, `APP_URL` kosong atau bukan URL menghasilkan galat
    yang jelas.
  - Pelajaran:
    - File yang lolos eslint bisa gagal Prettier hanya karena akhir baris
      CRLF (`.prettierrc` mewajibkan `lf`); `prettier --write` memperbaikinya.
    - Pola `.env*` di `.gitignore` ikut mengabaikan `.env.example`; perlu
      pengecualian `!`.
    - Dokumen resmi TanStack Start: server membaca `process.env` tanpa awalan,
      client hanya `VITE_`; urutan muat `.env.local`, `.env.production`,
      `.env.development`, `.env`. Baca env per permintaan di runtime edge;
      parse tingkat modul "fine for Node.js".
  - **Belum terverifikasi / perlu dikoreksi bila salah:**
    - `env` belum diimpor siapa pun, jadi belum terbukti `process.env` terisi
      dari `.env` saat `npm run dev` (Vite 8, `@tanstack/react-start: latest`).
      Buktikan saat pemakai pertama muncul (B1: `DATABASE_URL`). Bila kosong,
      muat `.env` secara eksplisit (mis. `loadEnv` Vite).
    - Dokumen resmi menyarankan `.env` di-commit dan rahasia di `.env.local`;
      proyek ini memilih `.env` di-ignore. Tinjau ulang bila tidak nyaman.
    - Target deploy belum diputuskan (C4). Bila edge, ganti
      `export const env = parseEnv()` menjadi fungsi `getEnv()` yang dipanggil
      dari handler.
    - Isi dokumen resmi dibaca lewat ringkasan WebFetch, bukan salinan mentah;
      cek ulang di https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables
  - Tindak lanjut (2026-10-27): kegagalan Prettier akibat CRLF diatasi
    permanen dengan `.gitattributes` (`* text=auto eol=lf`). Isi repo memang
    sudah LF; yang CRLF hanya salinan kerja akibat `core.autocrlf=true`. Setelah
    atribut ditambahkan, git tidak menulis ulang file yang dianggap bersih,
    jadi 13 file CRLF dihapus lalu di-`git checkout` agar terbentuk ulang LF.

### Penanganan Error (A3)
Spec: [2026-10-27-error-handling-design.md](./superpowers/specs/2026-10-27-error-handling-design.md).
Rencana: [2026-10-27-error-handling.md](./superpowers/plans/2026-10-27-error-handling.md).

- [x] Task 1, halaman 404 (2026-10-27): `ErrorLayout` (kerangka bersama) dan
  `NotFound` di `src/components/errors/`, dipasang sebagai
  `defaultNotFoundComponent` di `router.tsx`. Commit `66b40aa`.
- [x] Task 2, halaman 500 (2026-10-28): `ErrorFallback` dipasang sebagai
  `defaultErrorComponent`. Commit `ea0644c`.
  - Hasil: tombol "Coba lagi" (`router.invalidate()`) dan "Ke beranda"; pesan
    error muncul di bagian bawah layar lewat prop `details` di `ErrorLayout`,
    hanya saat `import.meta.env.DEV`.
  - Pelajaran:
    - `Button asChild` memakai `Slot` Radix yang hanya menerima **satu** anak.
      Dua anak melempar error saat render, sehingga halaman error malah
      menimbulkan error baru. Pisahkan menjadi dua `Button`.
    - `error` di `ErrorComponentProps` bertipe `unknown` (JavaScript boleh
      `throw` apa saja). Persempit dulu dengan `error instanceof Error`.
    - Konten di luar `ErrorLayout` jatuh di bawah layar karena `<main>` bertinggi
      `min-h-svh`. Agar pesan menempel di bawah layar tanpa menggeser konten
      yang dipusatkan, taruh di dalam `<main>` dengan `relative` pada `<main>`
      dan `absolute inset-x-0 bottom-0` pada pembungkus `details`.
    - JSX hanya boleh punya satu elemen akar per `return`.
    - Error saat render di server membuat React "beralih ke client rendering",
      sehingga `ErrorFallback` baru muncul di browser. Hasil `curl` tidak bisa
      membuktikan tampilannya; harus dilihat langsung di browser.
    - Auto import VS Code: pilih saran bernama sama (Enter/Tab) atau
      Ctrl + . pada nama yang bergaris merah. Periksa agar path memakai alias
      `@/`, bukan path relatif.
  - Catatan: `throw` sementara untuk uji dikembalikan sebelum commit; `git diff`
    harus bersih dari sisa pengujian.
- [~] Task 3, toast Sonner (2026-10-28): kode selesai, verifikasi di browser
  belum.
  - Langkah 1: `TECH-STACK.md` memuat baris Sonner (^2.0.8), konvensi umpan
    balik mutasi, dan entri Log Keputusan.
  - Langkah 2-5: `ui/sonner.tsx` dipasang lewat CLI shadcn lalu dilepas dari
    `next-themes` (paketnya di-uninstall); `AppToaster` di
    `features/theme/components/` membaca `useThemeStore`; dipasang di
    `routes/__root.tsx` di dekat `ThemeSync`.
  - Lolos `typecheck`, `lint`, `check`.
  - Pelajaran:
    - `create` dari Zustand mengembalikan hook yang terhubung ke penampung
      state di luar React; selector `(state) => state.theme` memilih bagian
      yang dibaca, dan komponen hanya dirender ulang bila hasilnya berubah.
      Nama parameter selector bebas; nama properti harus sama dengan
      `ThemeState`. `set` hanya menulis, bukan sumber bacaan.
    - `{...props}` ditaruh paling akhir di `<Sonner>` agar `theme` dari
      pemanggil menimpa bawaan, sehingga `ui/sonner.tsx` tetap generik.
  - Belum: Langkah 6 (uji `toast("tes toast")` sementara di browser, termasuk
    ganti tema) dan Langkah 7 (`ARCHITECTURE.md`, `ROADMAP.md` A3 menjadi `[x]`).
