# Tema Dark Mode (Zustand) Implementation Plan

> **Mode belajar:** rencana ini dipandu, bukan dieksekusi otomatis. **User menulis semua kode baru**; **Claude menulis/memperbarui semua file `.md`** dan memandu. Karena itu, tiap langkah kode berisi tujuan, antarmuka yang diharapkan, dan petunjuk. Kode lengkap tersedia di blok "Kunci jawaban" (lipat) untuk dibuka hanya bila buntu atau untuk dibandingkan setelah Anda selesai. Jangan jalankan dengan `subagent-driven-development`/`executing-plans`; kerjakan satu task per giliran bersama Claude.

**Goal:** Pengguna dapat memilih tema Light / Dark / System, tersimpan di `localStorage`, diterapkan tanpa kedipan, dengan tombol `ThemeToggle` yang bisa dipakai ulang (sekarang di layout `_auth`).

**Architecture:** Store Zustand (`persist`) menyimpan pilihan tema. `applyTheme` memasang class `dark` pada `<html>`; `ThemeSync` (efek client) menerapkan dan memantau preferensi OS; string `themeScript` di `head().scripts` memasang class lebih awal agar tidak berkedip. `ThemeToggle` (dropdown shadcn) mengubah store. Semua kode di `src/features/theme/`.

**Tech Stack:** Zustand 5.0.15, TanStack Start/Router (`head().scripts`), shadcn `dropdown-menu`, Tailwind 4 (`dark` variant sudah ada), lucide-react.

Spec: [2026-10-23-theme-dark-mode-design.md](../specs/2026-10-23-theme-dark-mode-design.md)

## Global Constraints

- Rujuk `docs/TECH-STACK.md`: dependensi baru dicatat dulu di dokumen itu (area, peran, Log Keputusan) sebelum dipasang; pin versi, hindari `latest`.
- Import memakai alias `@/...`; file `kebab-case`, komponen `PascalCase`, hook `useXxx`.
- Route tetap tipis: tidak ada logika tema di `src/routes/`, hanya memasang komponen/konstanta dari `features/theme`.
- Teks UI dan `aria-label` dalam Bahasa Indonesia; tombol non-submit memakai `type="button"`.
- Tidak ada magic string: kunci storage di `src/lib/constant.ts`; tidak ada `console.log` di hasil akhir.
- Gaya kode: tanpa titik koma, double quote, 2 spasi (jalankan `npm run format`).
- `src/components/ui/*` (shadcn) tidak diedit manual.
- Checklist akhir tiap task: `npm run typecheck`, `npm run lint`, `npm run check` lolos.

---

## Task 1: Fondasi state (dependensi, konstanta, tipe, store, `applyTheme`)

**Files:**
- Modify (Claude): `docs/TECH-STACK.md`
- Modify: `package.json` (lewat `npm i`), `src/lib/constant.ts`
- Create: `src/features/theme/types.ts`, `src/features/theme/store.ts`, `src/features/theme/apply-theme.ts`

**Interfaces:**
- Produces:
  - `THEME_STORAGE_KEY: string` di `@/lib/constant`
  - `THEMES` (`readonly ["light","dark","system"]`), `type Theme`, `isTheme(value: unknown): value is Theme` di `features/theme/types.ts`
  - `useThemeStore` di `features/theme/store.ts`; state `{ theme: Theme; setTheme: (theme: Theme) => void }`, default `"system"`
  - `DARK_MEDIA_QUERY: string` dan `applyTheme(theme: Theme): void` di `features/theme/apply-theme.ts`

- [ ] **Step 1 (Claude): Perbarui `docs/TECH-STACK.md`** — tambah baris tabel Zustand (^5.0.15, state UI sisi client), aturan keputusan baru "state UI client yang dibagi lintas komponen → Zustand; data server tetap loader/server function", dan satu entri Log Keputusan 2026-10-23. Dilakukan sebelum langkah berikutnya.

- [ ] **Step 2 (User): Pasang Zustand**

```bash
npm i zustand@5.0.15
```

Expected: `package.json` berisi `"zustand": "^5.0.15"`.

- [ ] **Step 3 (User): Tambah `THEME_STORAGE_KEY`** di `src/lib/constant.ts`. Petunjuk: konstanta string biasa, mis. `"app-plt-theme"`.

- [ ] **Step 4 (User): Tulis `types.ts`.** Petunjuk: daftar tema sebagai `as const` agar tipe `Theme` diturunkan darinya (`(typeof THEMES)[number]`); `isTheme` adalah *type guard* (`value is Theme`) yang dipakai store dan toggle untuk menolak nilai tak dikenal.

<details><summary>Kunci jawaban</summary>

```ts
export const THEMES = ["light", "dark", "system"] as const

export type Theme = (typeof THEMES)[number]

export function isTheme(value: unknown): value is Theme {
  return THEMES.some((theme) => theme === value)
}
```

</details>

- [ ] **Step 5 (User): Tulis `apply-theme.ts`.** Petunjuk: ekspor `DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)"`; `applyTheme` menghitung `isDark` (`dark` → true; `system` → hasil `window.matchMedia(...).matches`), lalu `document.documentElement.classList.toggle("dark", isDark)`.

<details><summary>Kunci jawaban</summary>

```ts
import type { Theme } from "./types"

export const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)"

export function applyTheme(theme: Theme) {
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia(DARK_MEDIA_QUERY).matches)
  document.documentElement.classList.toggle("dark", isDark)
}
```

</details>

- [ ] **Step 6 (User): Tulis `store.ts`.** Petunjuk: `create<State>()(persist(...))` dari `zustand` dan `zustand/middleware`; opsi `name: THEME_STORAGE_KEY`; `partialize` agar hanya `theme` yang disimpan; `merge` yang memakai `isTheme` sehingga nilai rusak/tak dikenal jatuh ke `current.theme` (`"system"`). Perhatikan tanda kurung ganda pada `create<...>()(...)` (kebutuhan TypeScript untuk middleware).

<details><summary>Kunci jawaban</summary>

```ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { THEME_STORAGE_KEY } from "@/lib/constant"
import { isTheme } from "./types"
import type { Theme } from "./types"

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme }),
      merge: (persisted, current) => {
        const theme = (persisted as Partial<ThemeState> | undefined)?.theme
        return { ...current, theme: isTheme(theme) ? theme : current.theme }
      },
    },
  ),
)
```

</details>

- [ ] **Step 7 (User): Verifikasi**

```bash
npm run format
npm run typecheck
npm run lint
npm run check
```

Expected: semuanya lolos tanpa error.

- [ ] **Step 8: Commit**

```bash
git add docs/TECH-STACK.md package.json package-lock.json src/lib/constant.ts src/features/theme
git commit -m "feat: add theme store with zustand"
```

---

## Task 2: Penerapan tema ke halaman (`ThemeSync`, `themeScript`, `__root.tsx`)

**Files:**
- Create: `src/features/theme/components/theme-sync.tsx`, `src/features/theme/theme-script.ts`
- Modify: `src/routes/__root.tsx`

**Interfaces:**
- Consumes: `useThemeStore`, `applyTheme`, `DARK_MEDIA_QUERY`, `THEME_STORAGE_KEY` (Task 1)
- Produces: `ThemeSync(): null` (komponen), `themeScript: string`

- [ ] **Step 1 (User): Tulis `theme-sync.tsx`.** Petunjuk: ambil `theme` dari store dengan selector; satu `useEffect` bergantung `[theme]` yang memanggil `applyTheme(theme)`. Bila `theme === "system"`, pasang listener `change` pada `window.matchMedia(DARK_MEDIA_QUERY)` yang memanggil `applyTheme(theme)` lagi, dan kembalikan fungsi cleanup yang melepas listener. Komponen mengembalikan `null`.

<details><summary>Kunci jawaban</summary>

```tsx
import { useEffect } from "react"
import { DARK_MEDIA_QUERY, applyTheme } from "../apply-theme"
import { useThemeStore } from "../store"

export function ThemeSync() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    applyTheme(theme)
    if (theme !== "system") return

    const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY)
    const handleChange = () => applyTheme(theme)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  return null
}
```

</details>

- [ ] **Step 2 (User): Tulis `theme-script.ts`.** Petunjuk: ekspor `themeScript` berupa *string* JavaScript satu baris (IIFE) yang berjalan sinkron sebelum render:
  1. `t = "system"`; dalam `try/catch`, `JSON.parse(localStorage.getItem(KEY)).state.theme`; bila `"light"` atau `"dark"`, `t` diganti. (`catch` kosong membuat nilai rusak/storage diblokir tetap jatuh ke `system`.)
  2. Hitung `d` seperti `applyTheme`, **di luar** `try` agar `system` tetap bekerja saat storage gagal.
  3. `document.documentElement.classList.toggle("dark", d)`.
  Sisipkan `THEME_STORAGE_KEY` dan `DARK_MEDIA_QUERY` dengan `JSON.stringify(...)` di dalam template string, agar tidak ada string ganda yang bisa menyimpang.

<details><summary>Kunci jawaban</summary>

```ts
import { THEME_STORAGE_KEY } from "@/lib/constant"
import { DARK_MEDIA_QUERY } from "./apply-theme"

export const themeScript = `(function(){var t="system";try{var v=JSON.parse(localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})).state.theme;if(v==="light"||v==="dark")t=v}catch(e){}var d=t==="dark"||(t==="system"&&matchMedia(${JSON.stringify(DARK_MEDIA_QUERY)}).matches);document.documentElement.classList.toggle("dark",d)})()`
```

</details>

- [ ] **Step 3 (User): Pasang di `src/routes/__root.tsx`.**
  - Di `head()`, tambahkan `scripts: [{ children: themeScript }]` (sejajar dengan `meta` dan `links`). `HeadContent` akan merendernya di `<head>`.
  - Di `RootDocument`, render `<ThemeSync />` di dalam `<body>` (mis. sebelum `{children}`).
  - `<html ... suppressHydrationWarning>` sudah ada, jadi class `dark` yang dipasang sebelum hydration tidak menimbulkan peringatan.
  - Bila `scripts: [{ children: ... }]` ditolak TypeScript, laporkan ke Claude; cadangannya `<script dangerouslySetInnerHTML>` di `<head>`.

- [ ] **Step 4 (User): Verifikasi otomatis**

```bash
npm run format
npm run typecheck
npm run lint
npm run check
```

Expected: lolos.

- [ ] **Step 5 (User): Verifikasi manual** — jalankan `npm run dev`, buka `http://localhost:3000/login`, lalu di Console DevTools:
  1. `localStorage.setItem("app-plt-theme", JSON.stringify({ state: { theme: "dark" }, version: 0 }))`, reload → `<html>` punya `class="dark"` dan halaman gelap tanpa kedipan terang.
  2. Ganti nilai ke `"light"`, reload → tidak ada class `dark`.
  3. Ganti ke `"system"`; di DevTools → Rendering → "Emulate CSS prefers-color-scheme: dark" → class `dark` muncul langsung tanpa reload; ubah ke light → hilang.
  4. `localStorage.setItem("app-plt-theme", "bukan-json")`, reload → tidak ada error di Console, halaman mengikuti OS.
  5. `curl -s http://localhost:3000/login` berisi skrip tema di `<head>` (cari `classList.toggle("dark"`).

- [ ] **Step 6: Commit**

```bash
git add src/features/theme src/routes/__root.tsx
git commit -m "feat: apply theme on load without flash"
```

---

## Task 3: Tombol pengganti tema (`ThemeToggle`) di layout `_auth`

**Files:**
- Create: `src/components/ui/dropdown-menu.tsx` (dihasilkan CLI shadcn), `src/features/theme/components/theme-toggle.tsx`
- Modify: `src/routes/_auth/route.tsx`

**Interfaces:**
- Consumes: `useThemeStore`, `isTheme`, `type Theme` (Task 1)
- Produces: `ThemeToggle(): JSX.Element`, diimpor dari `@/features/theme/components/theme-toggle`

- [ ] **Step 1 (User): Pasang komponen shadcn**

```bash
npx shadcn@latest add dropdown-menu
```

Expected: `src/components/ui/dropdown-menu.tsx` terbuat (style `radix-lyra`), memuat `DropdownMenuRadioGroup` dan `DropdownMenuRadioItem`. Jangan diedit manual. Bila `npm run lint`/`check` mengeluh pada file ini, beri tahu Claude untuk menambahkannya ke ignore (seperti yang sudah dilakukan untuk `field`).

- [ ] **Step 2 (User): Tulis `theme-toggle.tsx`.** Petunjuk:
  - Daftar opsi satu tempat: `THEME_OPTIONS: { value: Theme; label: string; icon: LucideIcon }[]` dengan label `Terang`, `Gelap`, `Sistem` dan ikon `Sun`, `Moon`, `Monitor` dari `lucide-react`. Render item lewat `.map`.
  - Pemicu: `DropdownMenuTrigger asChild` membungkus `<Button type="button" variant="outline" size="icon" aria-label="Ganti tema">`. Di dalamnya dua ikon yang ditukar lewat CSS: `<Sun className="dark:hidden" />` dan `<Moon className="hidden dark:block" />` (bukan kondisi JS, agar HTML server dan client sama).
  - Isi: `DropdownMenuContent align="end"` → `DropdownMenuRadioGroup value={theme} onValueChange={...}`. `onValueChange` menerima `string`, jadi panggil `setTheme` hanya bila `isTheme(value)`.

<details><summary>Kunci jawaban</summary>

```tsx
import { Monitor, Moon, Sun } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useThemeStore } from "../store"
import { isTheme } from "../types"
import type { Theme } from "../types"

const THEME_OPTIONS: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
  { value: "system", label: "Sistem", icon: Monitor },
]

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Ganti tema"
        >
          <Sun className="dark:hidden" />
          <Moon className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            if (isTheme(value)) setTheme(value)
          }}
        >
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

</details>

- [ ] **Step 3 (User): Pasang di `src/routes/_auth/route.tsx`.** Petunjuk: beri `<main>` class `relative`, lalu tambahkan `<div className="absolute top-4 right-4"><ThemeToggle /></div>` di dalamnya (di atas `<Outlet />`). Impor dari `@/features/theme/components/theme-toggle`. Route tetap tipis: hanya merangkai komponen.

- [ ] **Step 4 (User): Verifikasi otomatis**

```bash
npm run format
npm run typecheck
npm run lint
npm run check
```

Expected: lolos.

- [ ] **Step 5 (User): Verifikasi manual** di `http://localhost:3000/login` dan `/forgot-password`:
  1. Tombol muncul di kanan atas (juga pada lebar layar kecil); ikon matahari saat terang, bulan saat gelap.
  2. Menu menampilkan Terang / Gelap / Sistem dengan pilihan aktif ditandai; memilih masing-masing langsung mengubah tampilan.
  3. Reload mempertahankan pilihan tanpa kedipan terang.
  4. Dengan Sistem, mengganti tema OS (atau emulasi DevTools) mengubah tampilan langsung.
  5. Console bersih dari error dan peringatan hydration.
  6. Tombol dapat dijangkau keyboard (Tab, Enter/Spasi membuka menu, panah memilih).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/dropdown-menu.tsx src/features/theme src/routes/_auth/route.tsx
git commit -m "feat: add theme toggle to auth layout"
```

---

## Task 4: Penutup dokumentasi (Claude)

**Files:**
- Modify (Claude): `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/step.md`, `docs/TECH-STACK.md` (bila ada koreksi)

- [ ] **Step 1 (Claude): `ARCHITECTURE.md`** — tambahkan `features/theme` (store, `apply-theme`, `theme-script`, komponen) sebagai contoh fitur lintas halaman yang dikonsumsi oleh `routes`.
- [ ] **Step 2 (Claude): `ROADMAP.md`** — tambahkan item tema dark mode di Fase C dan tandai `[x]`.
- [ ] **Step 3 (Claude): `step.md`** — catat langkah Task 1-3 bertanggal 2026-10-23 beserta hal yang dipelajari (persist Zustand, skrip anti-kedip, ikon berbasis CSS).
- [ ] **Step 4: Commit**

```bash
git add docs
git commit -m "docs: record theme dark mode work"
```

---

## Self-Review

- **Spec coverage:** Light/Dark/System (store, `applyTheme`, toggle) ✔; `localStorage` + skrip inline (Task 1 `persist`, Task 2 `themeScript`) ✔; `features/theme` ✔; dropdown shadcn (Task 3) ✔; ikon CSS tanpa hydration mismatch (Task 3) ✔; kasus tepi storage diblokir/nilai rusak (`merge`+`isTheme`, `try/catch` skrip; diuji Task 2 langkah 5) ✔; pembaruan `TECH-STACK`/`ARCHITECTURE`/`step` oleh Claude ✔; verifikasi manual dan tiga perintah cek ✔; di luar cakupan (sinkron antar-tab, unit test) tidak dikerjakan ✔.
- **Placeholder scan:** tidak ada TBD/TODO; semua langkah kode punya petunjuk dan kunci jawaban lengkap (kecuali penempatan di `__root.tsx` dan `_auth/route.tsx`, yang dijelaskan baris demi baris karena hanya menyisipkan beberapa baris).
- **Konsistensi nama:** `THEME_STORAGE_KEY`, `THEMES`, `Theme`, `isTheme`, `useThemeStore`, `DARK_MEDIA_QUERY`, `applyTheme`, `themeScript`, `ThemeSync`, `ThemeToggle` konsisten antar task dan dengan spec.
