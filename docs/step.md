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
