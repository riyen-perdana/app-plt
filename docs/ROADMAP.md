# ROADMAP: Urutan Belajar & Membangun

Menjawab pertanyaan *kapan* dan *urutan*. Isi keputusan teknologi ada di
`TECH-STACK.md`, tata letak kode di `ARCHITECTURE.md`, catatan proses belajar
di `step.md`. Dokumen ini hanya menyimpan urutan, status, dan prasyarat; jangan
menyalin isi dokumen lain ke sini.

Status: `[ ]` belum, `[~]` sedang, `[x]` selesai.

## Fase A: Fondasi

| # | Item | Status | Catatan |
| --- | --- | --- | --- |
| A1 | Refactor login ke struktur feature-based | [x] | Prasyarat semua item lain. Lihat ARCHITECTURE.md |
| A2 | Validasi environment (Zod) + `.env.example` | [x] | Pembuktian `.env` terbaca di server menunggu pemakai pertama (B1). Lihat butir "Belum terverifikasi" di `step.md` |
| A3 | Penanganan error (boundary, 404/500, toast) | [~] | Spec dan rencana: `docs/superpowers/specs|plans/2026-10-27-error-handling*` |
| A4 | Pengujian (Vitest, Testing Library, Playwright) | [ ] | |
| A5 | Git hooks (Husky + lint-staged) | [ ] | |
| A6 | CI (GitHub Actions: lint, typecheck, test, build) | [ ] | Butuh A4 |

## Fase B: Inti aplikasi

| # | Item | Status | Catatan |
| --- | --- | --- | --- |
| B1 | Database dan ORM + migrasi/seeding | [ ] | Butuh A2 |
| B2 | Autentikasi dan otorisasi (sesi, Google Workspace, RBAC, guard `_app`) | [ ] | Butuh B1 |
| B3 | Keamanan (CSRF, rate limiting, header, sanitasi) | [ ] | Dikerjakan bersama B2 |
| B4 | Lapisan data client (loader/server function vs TanStack Query) | [ ] | Putuskan sebelum CRUD pertama |

## Fase C: Penyempurnaan

| # | Item | Status | Catatan |
| --- | --- | --- | --- |
| C1 | Logging terstruktur dan pelacakan error | [ ] | |
| C2 | UX: loading, skeleton, state kosong, aksesibilitas | [ ] | |
| C3 | Pengumpulan teks UI di satu tempat | [ ] | |
| C4 | Deployment (target, env, backup database) | [ ] | |
| C5 | README | [ ] | Diperbarui bertahap, dirapikan di akhir |
| C6 | Tema dark mode (light/dark/system) | [x] | Zustand `persist`, skrip anti-kedip. Lihat `features/theme` di ARCHITECTURE.md |

## Aturan kerja per item

1. Baca `TECH-STACK.md`, `ARCHITECTURE.md`, lalu item ini.
2. Jika butuh teknologi baru, catat di `TECH-STACK.md` (termasuk Log Keputusan) sebelum implementasi.
3. Jika struktur berubah, perbarui `ARCHITECTURE.md`.
4. Mode belajar: user menulis kode, Claude memandu. Catat langkah di `step.md`.
5. Setelah selesai dan lolos checklist ARCHITECTURE.md, ubah status di sini.
