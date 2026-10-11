# Rencana: Fitur Lupa Password (Tampilan Saja)

Dibuat: 2026-10-11. Mode belajar: kode ditulis sendiri, Claude hanya memandu.
Rujukan aturan: [ARCHITECTURE.md](./ARCHITECTURE.md) dan [TECH-STACK.md](./TECH-STACK.md).

## Rancangan

Strukturnya mengikuti pola halaman login yang sudah ada. Route `_auth` sudah
menyediakan layout dua kolom, jadi halaman baru cukup masuk ke `<Outlet />`.

```
src/
  routes/_auth/
    forgot-password.tsx            # route tipis: head + merender halaman
  features/auth/components/
    forgot-password-form.tsx       # form: 1 field + tombol
```

Karena hanya tampilan, **tidak perlu** schema, hook baru, atau `onSubmit`
sungguhan.

## Langkah-langkah

1. **Buat route** `src/routes/_auth/forgot-password.tsx`.
   - Salin kerangka `src/routes/_auth/login.tsx`: `createFileRoute("/_auth/forgot-password")`,
     `head`, dan `component`.
   - Isi halaman dari atas ke bawah: `<Logo />`, judul ("Lupa kata sandi?" dengan
     satu kalimat penjelasan), `<ForgotPasswordForm />`, lalu tautan
     "Kembali ke halaman masuk".
   - `routeTree.gen.ts` dibuat otomatis saat dev server jalan; jangan diedit tangan.

2. **Buat form** `src/features/auth/components/forgot-password-form.tsx`.
   - Satu field saja: pakai `TextField` yang sudah ada, label "Email",
     `autoComplete="email"`.
   - Komponen yang dibutuhkan sudah tersedia: `Button` dan `FieldGroup`.
   - Pakai `useAppForm` (konsisten dengan login) supaya `TextField` bisa dipakai
     ulang. `defaultValues` cukup `{ email: "" }`, `onSubmit` dikosongkan.

3. **Sambungkan tautan "Lupa Kata Sandi?"** di
   `src/features/auth/components/login-form.tsx`.
   - Sekarang masih `<a href="#">`. Ganti dengan `Link` dari
     `@tanstack/react-router` yang mengarah ke `/forgot-password`.
   - `Link` yang sama dipakai untuk "Kembali ke halaman masuk" (arah `/login`).

4. **Cek hasilnya.**
   - `npm run dev`, buka `/login`, klik tautannya.
   - Jalankan `npm run typecheck`, `npm run lint`, dan `npm run check`.

## Keputusan yang perlu diambil

- **Pesan setelah submit.** Saran: biarkan tombol belum melakukan apa-apa dulu.
  Opsi lain: tampilkan state "Tautan telah dikirim" dengan `useState` agar
  tampilan lengkap; bisa ditambahkan belakangan.
- **Teks UI.** Ikuti kebiasaan yang sudah ada (teks ditulis langsung di
  komponen, seperti di halaman login).

## Checklist

- [x] Route `/forgot-password` tampil di dalam layout `_auth`
- [x] Form berisi satu field email + tombol
- [x] Tautan di halaman login mengarah ke halaman baru
- [x] Tautan "Kembali ke halaman masuk" berfungsi
- [x] Lolos `typecheck`, `lint`, `check`
- [x] Tidak ada import tak terpakai; `console.log` di `onSubmit` sengaja disamakan dengan login (placeholder sampai Langkah 5)
- [x] Catat langkah di `docs/step.md` setelah selesai
