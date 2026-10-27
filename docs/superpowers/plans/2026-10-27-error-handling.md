# Penanganan Error (A3) Implementation Plan

> **Mode belajar:** rencana ini dipandu, bukan dieksekusi otomatis. **User menulis semua kode baru**; **Claude menulis/memperbarui semua file `.md`** dan memandu. Karena itu, tiap langkah kode berisi tujuan, antarmuka yang diharapkan, dan petunjuk. Kode lengkap tersedia di blok "Kunci jawaban" (lipat) untuk dibuka hanya bila buntu atau untuk dibandingkan setelah Anda selesai. Jangan jalankan dengan `subagent-driven-development`/`executing-plans`; kerjakan satu task per giliran bersama Claude.

**Goal:** Halaman 404 dan 500 berbahasa Indonesia yang mengikuti tema, terpasang sebagai default seluruh route, ditambah `Toaster` (Sonner) di root agar fitur berikutnya cukup memanggil `toast.error(...)`.

**Architecture:** `defaultNotFoundComponent` dan `defaultErrorComponent` diisi di `getRouter()` sehingga berlaku untuk semua route. Dua tampilan memakai satu kerangka bersama (`ErrorLayout`) di `src/components/errors/`. `Toaster` dibungkus `AppToaster` di `features/theme` yang membaca tema dari Zustand; `ui/sonner.tsx` tetap generik (menerima `theme` lewat props) agar arah dependensi `routes -> features -> components` tidak terbalik.

**Tech Stack:** TanStack Router (`defaultErrorComponent`, `defaultNotFoundComponent`, `Link`, `useRouter`), shadcn `button` (sudah ada) dan `sonner` (baru, lewat CLI), Zustand (`useThemeStore`), Tailwind 4.

Spec: [2026-10-27-error-handling-design.md](../specs/2026-10-27-error-handling-design.md)

## Global Constraints

- Rujuk `docs/TECH-STACK.md`: dependensi baru dicatat dulu di dokumen itu (area, peran, Log Keputusan) sebelum dipasang; pin versi, hindari `latest`.
- Import memakai alias `@/...`; file `kebab-case`, komponen `PascalCase`.
- Route tetap tipis: `routes/__root.tsx` hanya memasang komponen; tidak ada logika di sana.
- Teks UI dalam Bahasa Indonesia; tombol non-submit memakai `type="button"`.
- Detail error (`error.message`) hanya tampil saat `import.meta.env.DEV`.
- Tidak ada `console.log` di hasil akhir; tidak ada magic string baru yang berulang.
- Gaya kode: tanpa titik koma, double quote, 2 spasi (jalankan `npm run format`).
- `src/components/ui/*` (shadcn) hanya diedit bila perlu; satu-satunya pengecualian di rencana ini adalah `ui/sonner.tsx` (lepas dari `next-themes`).
- Checklist akhir tiap task: `npm run typecheck`, `npm run lint`, `npm run check` lolos.

---

## Task 1: Halaman 404 (kerangka bersama + `NotFound` + pemasangan default)

**Files:**
- Create: `src/components/errors/error-layout.tsx`, `src/components/errors/not-found.tsx`
- Modify: `src/router.tsx`, `src/routes/__root.tsx` (hapus `notFoundComponent`)

**Interfaces:**
- Produces:
  - `ErrorLayout` di `@/components/errors/error-layout`: props `{ code: string; title: string; description: string; children?: React.ReactNode }`. Merender `<main>` di tengah layar: kode, judul (`<h1>`), deskripsi, lalu `children` (area tombol).
  - `NotFound(): JSX.Element` di `@/components/errors/not-found`.

- [ ] **Step 1 (User): Tulis `error-layout.tsx`.** Petunjuk: `<main>` dengan `flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center`; kode memakai `<p>` besar dan tebal (`text-4xl font-semibold`), judul `<h1 className="text-lg font-semibold">`, deskripsi `<p className="max-w-sm text-xs/relaxed text-muted-foreground">`; `children` dibungkus `<div className="flex gap-2">`. Hanya token warna yang sudah ada, tanpa warna mentah, supaya otomatis mengikuti tema.

<details><summary>Kunci jawaban</summary>

```tsx
type ErrorLayoutProps = {
  code: string
  title: string
  description: string
  children?: React.ReactNode
}

export function ErrorLayout({
  code,
  title,
  description,
  children,
}: ErrorLayoutProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-4xl font-semibold">{code}</p>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="max-w-sm text-xs/relaxed text-muted-foreground">
        {description}
      </p>
      <div className="flex gap-2">{children}</div>
    </main>
  )
}
```

</details>

- [ ] **Step 2 (User): Tulis `not-found.tsx`.** Petunjuk: pakai `ErrorLayout` dengan `code="404"`, judul "Halaman tidak ditemukan", deskripsi satu kalimat. Tombol "Ke beranda": `Button` dengan `asChild` membungkus `Link` dari `@tanstack/react-router` (`to="/"`). `asChild` membuat `Button` meneruskan gayanya ke `Link`, jadi tidak ada `<button>` di dalam `<a>`.

<details><summary>Kunci jawaban</summary>

```tsx
import { Link } from "@tanstack/react-router"
import { ErrorLayout } from "@/components/errors/error-layout"
import { Button } from "@/components/ui/button"

export function NotFound() {
  return (
    <ErrorLayout
      code="404"
      title="Halaman tidak ditemukan"
      description="Alamat yang Anda buka tidak ada atau sudah dipindahkan."
    >
      <Button asChild>
        <Link to="/">Ke beranda</Link>
      </Button>
    </ErrorLayout>
  )
}
```

</details>

- [ ] **Step 3 (User): Pasang di `router.tsx`.** Petunjuk: tambahkan `defaultNotFoundComponent: NotFound` ke objek opsi `createTanStackRouter`, dan impor komponennya.

- [ ] **Step 4 (User): Hapus `notFoundComponent` bawaan di `__root.tsx`** (blok berbahasa Inggris tanpa gaya). Bila dibiarkan, ia menimpa default router.

- [ ] **Step 5 (User): Verifikasi.** Jalankan `npm run dev`, buka `http://localhost:3000/tidak-ada`.
  Expected: halaman "404 · Halaman tidak ditemukan" di tengah layar; tombol "Ke beranda" membawa ke `/`; tampilan benar di light dan dark (ganti lewat `ThemeToggle` di halaman login, lalu kembali ke URL ngawur). Lalu `npm run typecheck`, `npm run lint`, `npm run check` lolos.

- [ ] **Step 6: Commit** (setelah user setuju)

```bash
git add src/components/errors src/router.tsx src/routes/__root.tsx
git commit -m "feat: add 404 page as router default"
```

---

## Task 2: Halaman 500 (`ErrorFallback` + pemasangan default)

**Files:**
- Create: `src/components/errors/error-fallback.tsx`
- Modify: `src/router.tsx`

**Interfaces:**
- Consumes: `ErrorLayout` dari Task 1.
- Produces: `ErrorFallback(props: ErrorComponentProps): JSX.Element` di `@/components/errors/error-fallback` (`ErrorComponentProps` dari `@tanstack/react-router`, berisi `error`, `info`, `reset`).

- [ ] **Step 1 (User): Tulis `error-fallback.tsx`.** Petunjuk:
  - Terima `{ error }: ErrorComponentProps`. Ambil router dengan `useRouter()`.
  - `ErrorLayout` dengan `code="500"`, judul "Terjadi kesalahan", deskripsi umum (mis. "Maaf, ada masalah di sisi kami. Silakan coba lagi.").
  - Tombol "Coba lagi" (`type="button"`, `onClick={() => router.invalidate()}`) dan "Ke beranda" (`Button variant="outline" asChild` + `Link`).
  - Mengapa `router.invalidate()`, bukan `reset`: `reset` hanya mereset batas error lokal, sedangkan error dari loader tetap tersimpan di match route. `invalidate()` memuat ulang loader dan ikut mereset boundary (pola di dokumentasi TanStack Router).
  - Saat `import.meta.env.DEV`, tampilkan `error.message` di `<pre>` kecil (`max-w-full overflow-auto bg-muted p-2 text-left text-xs`) di bawah tombol atau di dalam `children`. Di produksi blok ini tidak dirender sama sekali (bukan sekadar disembunyikan lewat CSS).

<details><summary>Kunci jawaban</summary>

```tsx
import { Link, useRouter } from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"
import { ErrorLayout } from "@/components/errors/error-layout"
import { Button } from "@/components/ui/button"

export function ErrorFallback({ error }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <ErrorLayout
      code="500"
      title="Terjadi kesalahan"
      description="Maaf, ada masalah di sisi kami. Silakan coba lagi."
    >
      <Button type="button" onClick={() => router.invalidate()}>
        Coba lagi
      </Button>
      <Button variant="outline" asChild>
        <Link to="/">Ke beranda</Link>
      </Button>
      {import.meta.env.DEV && (
        <pre className="mt-2 max-w-full basis-full overflow-auto bg-muted p-2 text-left text-xs">
          {error.message}
        </pre>
      )}
    </ErrorLayout>
  )
}
```

Catatan: pada kunci jawaban ini `<pre>` ikut berada di dalam `div.flex` milik `ErrorLayout`, sehingga `basis-full` perlu agar turun ke baris baru. Boleh juga dirapikan dengan menambah prop `details` di `ErrorLayout`; pilih salah satu dan konsisten.

</details>

- [ ] **Step 2 (User): Pasang di `router.tsx`.** Tambahkan `defaultErrorComponent: ErrorFallback` dan impornya.

- [ ] **Step 3 (User): Verifikasi.** Sisipkan sementara `throw new Error("tes 500")` di badan komponen sebuah route (mis. `src/routes/index.tsx`), buka route itu.
  Expected:
  - Muncul "500 · Terjadi kesalahan" dengan `error.message` ("tes 500") di bawahnya (karena `npm run dev`).
  - Hapus `throw` itu, simpan, klik "Coba lagi": halaman kembali normal tanpa loop error.
  - Tampilan benar di light dan dark.
  - Kembalikan `throw` sementara tadi sebelum commit. Pastikan `git diff` tidak memuatnya.
  - Opsional untuk bukti produksi: `npm run build` lalu `npm run preview` dengan `throw` sementara; `error.message` tidak boleh tampil. Hapus `throw` lagi sesudahnya.
  Lalu `npm run typecheck`, `npm run lint`, `npm run check` lolos.

- [ ] **Step 4: Commit** (setelah user setuju)

```bash
git add src/components/errors src/router.tsx
git commit -m "feat: add 500 error fallback as router default"
```

---

## Task 3: Toast (Sonner + `AppToaster` terhubung tema)

**Files:**
- Modify (Claude): `docs/TECH-STACK.md`
- Modify: `package.json` (lewat CLI), `src/components/ui/sonner.tsx` (dibuat CLI, lalu disesuaikan), `src/routes/__root.tsx`
- Create: `src/features/theme/components/app-toaster.tsx`

**Interfaces:**
- Produces:
  - `Toaster` di `@/components/ui/sonner`: menerima `ToasterProps` dari `sonner` (termasuk `theme`), tanpa membaca tema sendiri.
  - `AppToaster(): JSX.Element` di `@/features/theme/components/app-toaster`: membaca `theme` dari `useThemeStore` dan merender `Toaster` dengan tema itu.
  - Pemakai fitur: `import { toast } from "sonner"` lalu `toast.error("...")`.

- [ ] **Step 1 (Claude): Perbarui `docs/TECH-STACK.md`** — baris tabel Sonner (area Toast/notifikasi, peran umpan balik mutasi), entri Log Keputusan 2026-10-27 (alasan: komponen shadcn resmi; tema dari Zustand, tanpa `next-themes`), dan butir konvensi "umpan balik hasil mutasi → `toast` dari `sonner`; error validasi tetap `FieldError`". Dilakukan sebelum langkah berikutnya.

- [ ] **Step 2 (User): Pasang komponen lewat CLI shadcn**

```bash
npx shadcn@latest add sonner
```

Expected: `src/components/ui/sonner.tsx` terbentuk; `package.json` bertambah `sonner` dan kemungkinan `next-themes`. Periksa versi yang masuk, lalu pin (hapus `^` atau gunakan `npm i sonner@<versi>` sesuai kebiasaan repo; hindari `latest`).

- [ ] **Step 3 (User): Sesuaikan `ui/sonner.tsx`.** Petunjuk: file bawaan memanggil `useTheme()` dari `next-themes` untuk mengisi prop `theme`. Hapus impor dan pemanggilan itu; biarkan `theme` datang dari props (`ToasterProps` sudah memuatnya). Jangan impor apa pun dari `features/` di sini (arah dependensi). Sesudahnya, bila `next-themes` tidak dipakai lagi di tempat lain, lepaskan: `npm uninstall next-themes`.

<details><summary>Kunci jawaban (bentuk akhir yang diharapkan; sesuaikan dengan keluaran CLI Anda)</summary>

```tsx
import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

// Bagian ikon dan style bawaan CLI dipertahankan apa adanya.
function Toaster(props: ToasterProps) {
  return <Sonner {...props} />
}

export { Toaster }
```

Bila CLI menambahkan `icons`, `style`, atau `toastOptions`, biarkan; yang dibuang hanya `useTheme` dan `theme={theme as ...}`.

</details>

- [ ] **Step 4 (User): Tulis `app-toaster.tsx`** di `src/features/theme/components/`. Petunjuk: ambil `theme` dengan `useThemeStore((state) => state.theme)` dan render `<Toaster theme={theme} />`. Nilai `"light" | "dark" | "system"` sudah cocok dengan tipe `theme` Sonner.

<details><summary>Kunci jawaban</summary>

```tsx
import { Toaster } from "@/components/ui/sonner"
import { useThemeStore } from "../store"

export function AppToaster() {
  const theme = useThemeStore((state) => state.theme)

  return <Toaster theme={theme} />
}
```

</details>

- [ ] **Step 5 (User): Pasang di `__root.tsx`.** Impor `AppToaster` dan render `<AppToaster />` di `<body>`, di dekat `<ThemeSync />`.

- [ ] **Step 6 (User): Verifikasi.** Sisipkan sementara pemanggilan `toast("tes toast")` (impor dari `sonner`) di sebuah handler, mis. `onClick` tombol di halaman login, atau `useEffect` di komponen sementara.
  Expected: toast muncul; warnanya mengikuti pilihan tema (ganti Terang/Gelap/Sistem lalu picu lagi). Reload tidak memunculkan peringatan hydration di console. Hapus semua pemanggilan sementara; `git diff` tidak boleh memuatnya. Lalu `npm run typecheck`, `npm run lint`, `npm run check` lolos.

- [ ] **Step 7 (Claude): Perbarui dokumen penutup** — `ARCHITECTURE.md` (tambah `components/errors` dan `AppToaster` di `features/theme`), `ROADMAP.md` (A3 → `[x]`), dan `step.md` (catat langkah). Baru setelah semua lolos:

- [ ] **Step 8: Commit** (setelah user setuju)

```bash
git add package.json package-lock.json src docs
git commit -m "feat: add toast via sonner and wire theme"
```
