# Desain: Penanganan Error (A3)

Tanggal: 2026-10-27. Status: menunggu tinjauan.

## Tujuan

Setiap kegagalan yang terlihat pengguna (halaman tidak ada, error saat render
atau loader) tampil sebagai halaman berbahasa Indonesia yang rapi, mengikuti
tema light/dark, dengan jalan keluar yang jelas (Coba lagi, Ke beranda). Toast
tersedia di seluruh aplikasi untuk umpan balik mutasi, sehingga fitur berikutnya
cukup memanggil `toast.error(...)`.

Di luar cakupan: pemakaian toast di form (menunggu server function pertama di
B2), logging dan pelacakan error (C1), halaman error khusus per route, tes
otomatis (A4).

## Keputusan

| Topik | Keputusan | Alasan |
| --- | --- | --- |
| Cakupan | Fondasi lengkap: 404, 500, `Toaster`. Tanpa contoh toast di form | Belum ada mutasi yang bisa gagal; contoh sementara harus dibuang lagi di B2 |
| Penempatan boundary | `defaultErrorComponent` dan `defaultNotFoundComponent` di `getRouter()` | Satu tempat untuk semua route; route tertentu tetap bisa menimpa |
| Lokasi kode | `src/components/errors/` | Dipakai lintas fitur, bukan milik satu domain (ARCHITECTURE.md) |
| Detail error | `error.message` tampil hanya saat `import.meta.env.DEV` | Mudah debug saat dev, tidak membocorkan detail internal di produksi |
| Toast | Sonner via CLI shadcn; `ui/sonner.tsx` tetap generik (tema lewat props, tanpa `next-themes`); `AppToaster` di `features/theme` membaca `useThemeStore` | Aturan UI TECH-STACK (komponen shadcn lewat CLI); satu sumber kebenaran tema; `components/` tidak boleh mengimpor dari `features/` |
| Helper toast | Tidak ada; fitur memanggil `toast` dari `sonner` langsung | YAGNI |

## Struktur

```
src/components/
  errors/
    error-layout.tsx     # kerangka bersama: kode, judul, deskripsi, area tombol
    not-found.tsx        # tampilan 404
    error-fallback.tsx   # tampilan 500 (menerima ErrorComponentProps)
  ui/
    sonner.tsx           # Toaster (CLI shadcn, dilepas dari next-themes)
src/features/theme/components/
  app-toaster.tsx        # Toaster yang membaca tema dari useThemeStore
```

Perubahan di luar folder itu:

- `src/router.tsx`: tambah `defaultErrorComponent: ErrorFallback` dan
  `defaultNotFoundComponent: NotFound` pada `createTanStackRouter`.
- `src/routes/__root.tsx`: hapus `notFoundComponent` bawaan (Inggris, tanpa
  gaya) agar tidak menimpa default router; pasang `<AppToaster />` di `<body>`.
- `docs/TECH-STACK.md`: baris Sonner di tabel stack dan entri Log Keputusan
  (termasuk alasan penyesuaian tema lewat Zustand).
- `docs/ARCHITECTURE.md`: tambahkan `components/errors` pada struktur.
- `docs/ROADMAP.md`: A3 menjadi `[x]` setelah selesai.
- `docs/step.md`: catat langkah.

## Komponen

- **`ErrorLayout`.** Kerangka bersama (props `code`, `title`, `description`,
  `children`) agar 404 dan 500 tidak menduplikasi tata letak. Konten di tengah
  layar (`min-h-svh`), tanpa layout `_auth`/`_app`, karena boundary bisa muncul
  di route mana pun. Memakai token warna Tailwind yang sudah ada, sehingga
  otomatis mengikuti tema.
- **`NotFound`.** `ErrorLayout` dengan kode "404", judul "Halaman tidak
  ditemukan", satu kalimat penjelasan, dan tombol "Ke beranda" (`Link to="/"`
  dengan `Button asChild`).
- **`ErrorFallback`.** Menerima `ErrorComponentProps`. Judul "Terjadi
  kesalahan", pesan umum, tombol "Coba lagi" dan "Ke beranda". "Coba lagi"
  memanggil `router.invalidate()`, bukan `reset`: `reset` hanya mereset batas
  error lokal, sedangkan error dari loader tetap tersimpan di match route.
  Bila `import.meta.env.DEV`, `error.message` ditampilkan di blok kecil; di
  produksi blok itu tidak dirender.
- **`ui/sonner.tsx` dan `AppToaster`.** `Toaster` shadcn dilepas dari
  `next-themes` dan menerima `theme` lewat props. `AppToaster` membaca `theme`
  dari `useThemeStore` dan meneruskannya; nilai `system` diteruskan apa adanya
  karena Sonner mendukungnya. Pembungkus ini ada di `features/theme` agar arah
  dependensi `routes -> features -> components` terjaga.

## Alur

1. URL tidak cocok route: router merender `NotFound` di dalam shell root.
2. Error saat render atau loader di route mana pun: router menangkapnya dan
   merender `ErrorFallback`; "Coba lagi" memanggil `router.invalidate()` untuk
   memuat ulang dan mereset boundary.
3. Fitur yang butuh umpan balik (nanti): `toast.error("...")` dari `sonner`;
   `Toaster` di root yang menampilkannya.

## Kasus tepi

- Error di komponen root sendiri: `defaultErrorComponent` tetap dirender di
  dalam `shellComponent` (`RootDocument`), sehingga `<html>`, tema, dan
  `Toaster` tetap ada.
- Error server function: dilempar ke boundary yang sama bila tidak ditangani;
  kegagalan yang bisa ditangani (mis. validasi) memakai toast atau `FieldError`.
- Produksi: `error.message` tidak pernah tampil.
- Hydration: `Toaster` Sonner hanya merender isi saat ada toast, jadi tidak
  menambah selisih HTML server dan client.

## Verifikasi

Belum ada framework tes (A4).

- `npm run typecheck`, `npm run lint`, `npm run check` lolos.
- Manual di browser:
  - Membuka `/tidak-ada` menampilkan `NotFound` berbahasa Indonesia; tombol
    "Ke beranda" bekerja; tampilan benar di light dan dark.
  - Melempar error sementara di sebuah route menampilkan `ErrorFallback`,
    `error.message` muncul saat `npm run dev`; "Coba lagi" tidak memicu loop
    error setelah error sementara dihapus.
  - Build produksi (`npm run build` lalu `npm run preview`) tidak menampilkan
    `error.message`.
  - Memanggil `toast("tes")` sementara dari konsol/komponen menampilkan toast
    dengan tema yang benar; hapus pemanggilan sementara sesudahnya.
- Unit test komponen ditunda sampai A4.

## Urutan kerja (mode belajar)

Pembagian: semua file `.md` ditulis dan diperbarui Claude; kode baru ditulis
user, Claude memandu.

Rinciannya ada di rencana
[2026-10-27-error-handling.md](../plans/2026-10-27-error-handling.md), tiga task:

1. **404:** `error-layout.tsx`, `not-found.tsx`, pasang di `router.tsx`, hapus
   `notFoundComponent` di `__root.tsx`.
2. **500:** `error-fallback.tsx`, pasang di `router.tsx`.
3. **Toast:** Claude memperbarui `TECH-STACK.md` lebih dulu; user memasang
   `sonner` lewat CLI shadcn dan pin versinya, melepas `next-themes`, menulis
   `app-toaster.tsx`, dan memasangnya di `__root.tsx`. Claude lalu memperbarui
   `ARCHITECTURE.md`, `ROADMAP.md`, dan `step.md`.

Tiap task diakhiri verifikasi manual dan `typecheck`/`lint`/`check`; commit per
task setelah user setuju.
