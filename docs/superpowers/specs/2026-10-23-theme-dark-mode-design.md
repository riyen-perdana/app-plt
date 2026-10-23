# Desain: Tema Dark Mode (Zustand)

Tanggal: 2026-10-23. Status: menunggu tinjauan.

## Tujuan

Pengguna dapat memilih tema **Light**, **Dark**, atau **System** (mengikuti OS).
Pilihan tersimpan di browser, diterapkan tanpa kedipan saat halaman dimuat, dan
tombol pengganti tema dapat dipakai ulang di halaman mana pun. Sekarang
dipasang di layout `_auth`; nanti bisa dipasang di dashboard.

Di luar cakupan: sinkronisasi antar-tab (event `storage`), penyimpanan tema di
server/akun pengguna, tema selain light/dark.

## Keputusan

| Topik | Keputusan | Alasan |
| --- | --- | --- |
| Pilihan tema | Light / Dark / System | Pola umum dan ramah pengguna; `system` memakai `prefers-color-scheme` |
| Penyimpanan | `localStorage` lewat middleware `persist` Zustand + skrip inline di `<head>` | Server tidak bisa membaca `localStorage`; skrip sinkron mencegah *flash of wrong theme* |
| Lokasi kode | `src/features/theme/` | Sesuai `ARCHITECTURE.md`: `routes` memakai `features` |
| Bentuk tombol | Dropdown shadcn (`dropdown-menu`) dengan tiga pilihan | Aturan UI TECH-STACK: komponen shadcn lewat CLI |
| Zustand | Hanya untuk state UI sisi client yang dibagi lintas komponen | Data server tetap lewat loader/server function |

## Struktur

```
src/features/theme/
  types.ts                   # type Theme = "light" | "dark" | "system"
  store.ts                   # store Zustand (persist)
  apply-theme.ts             # resolve tema akhir + toggle class "dark" di <html>
  components/
    theme-script.tsx         # skrip inline anti-kedip untuk <head>
    theme-sync.tsx           # efek client: terapkan tema, pantau preferensi OS
    theme-toggle.tsx         # tombol ikon + dropdown
```

Perubahan di luar folder fitur:

- `src/lib/constant.ts`: tambah `THEME_STORAGE_KEY`.
- `src/routes/__root.tsx`: pasang `ThemeScript` di `<head>` dan `ThemeSync` di `<body>`.
- `src/routes/_auth/route.tsx`: pasang `ThemeToggle` di pojok kanan atas.
- `src/components/ui/dropdown-menu.tsx`: ditambahkan lewat CLI shadcn.
- `docs/TECH-STACK.md`: baris Zustand, aturan state client, entri Log Keputusan.
- `docs/ARCHITECTURE.md`: tambahkan `features/theme` pada struktur.

`src/styles.css` tidak berubah: `@custom-variant dark` dan blok `.dark` sudah ada.

## Komponen

- **Store.** State `{ theme: Theme, setTheme }`, default `"system"`. `persist`
  memakai kunci `THEME_STORAGE_KEY`; format simpan `{"state":{"theme":...},"version":0}`.
  Nilai selain `light | dark | system` dianggap `system`.
- **`applyTheme(theme)`.** `system` diterjemahkan lewat
  `matchMedia("(prefers-color-scheme: dark)")`; class `dark` di-toggle pada
  `document.documentElement`.
- **`ThemeSync`.** Memanggil `applyTheme` setiap `theme` berubah. Saat `system`,
  memasang listener `change` pada `matchMedia` dan melepasnya saat tema lain
  dipilih atau komponen di-unmount.
- **`ThemeScript`.** Skrip inline sinkron: baca `localStorage[THEME_STORAGE_KEY]`,
  ambil `state.theme`, tentukan dark/tidak, pasang class `dark`. Dibungkus
  `try/catch`; gagal berarti `system`. Kunci disisipkan dari konstanta yang sama
  dengan store agar tidak menyimpang.
- **`ThemeToggle`.** Tombol ikon (`aria-label` dalam Bahasa Indonesia) dengan
  ikon matahari/bulan yang ditukar lewat class CSS `dark:`, bukan kondisi JS,
  sehingga HTML server dan client sama (tanpa hydration mismatch). Dropdown
  berisi Terang / Gelap / Sistem dan menandai pilihan aktif.

## Alur data

1. Muat halaman: `ThemeScript` memasang class `dark` sebelum render pertama.
2. Hydration: store mulai dari `system`, `persist` memuat nilai tersimpan,
   `ThemeSync` memanggil `applyTheme` dengan hasil yang sama seperti skrip.
3. Pengguna memilih tema: `setTheme` → `persist` menyimpan → `ThemeSync` menerapkan.
4. Mode `system`: perubahan tema OS langsung diterapkan lewat listener.

## Kasus tepi

- `localStorage` diblokir atau melempar error: skrip jatuh ke `system`; store
  tetap berjalan tanpa menyimpan.
- Nilai tersimpan rusak atau tidak dikenal: dianggap `system`.
- Hydration: ikon berbasis CSS; penanda pilihan aktif hanya tampil saat menu
  dibuka, setelah hydration selesai.

## Verifikasi

Belum ada framework tes (Vitest ada di ROADMAP A4).

- `npm run typecheck`, `npm run lint`, `npm run check` lolos.
- Manual di browser:
  - Light/Dark/System mengubah tampilan di halaman login dan lupa password.
  - Reload mempertahankan pilihan tanpa kedipan terang.
  - Dengan System, mengganti tema OS mengubah tampilan langsung.
  - Menghapus atau merusak kunci di `localStorage` tidak memunculkan error di console.
- Unit test `applyTheme` ditunda sampai A4.

## Urutan kerja (mode belajar)

Pembagian: semua file `.md` ditulis dan diperbarui Claude; kode baru ditulis
user, Claude memandu.

1. **Claude:** perbarui `TECH-STACK.md` (baris Zustand, aturan state client,
   Log Keputusan). **User:** `npm i zustand` (pin versi).
2. **User:** `THEME_STORAGE_KEY`, `types.ts`, `store.ts`.
3. **User:** `apply-theme.ts`, `theme-sync.tsx`.
4. **User:** `theme-script.tsx`; pasang `ThemeScript` dan `ThemeSync` di `__root.tsx`.
5. **User:** pasang shadcn `dropdown-menu`, tulis `theme-toggle.tsx`, pasang di layout `_auth`.
6. **User:** verifikasi manual dan jalankan `typecheck`/`lint`/`check`.
   **Claude:** perbarui `ARCHITECTURE.md`, `ROADMAP.md` bila perlu, dan catat
   langkah di `step.md`. Commit setelah semuanya lolos.
