# Pedoman Arsitektur: Skalabel & Clean Code

Rujukan wajib sebelum menambah fitur atau memodifikasi kode. Pelengkap dari `TECH-STACK.md`.

## 1. Struktur folder (feature-based)

```
src/
  routes/            # tipis: hanya definisi route + merangkai komponen fitur
  features/
    <domain>/        # contoh: auth, mahasiswa, dosen
      components/    # UI khusus fitur (mis. login-form.tsx)
      hooks/         # logika/state khusus fitur
      api/           # pemanggilan server/API (server function, fetcher)
      schemas/       # skema Zod milik fitur
      types.ts
  components/
    ui/              # shadcn (jangan diubah isinya tanpa alasan)
    ...              # komponen umum lintas fitur
  lib/               # util, konstanta, konfigurasi lintas fitur
```

Aturan dependensi: `routes` -> `features` -> `components`/`lib`. Fitur tidak boleh mengimpor dari fitur lain secara langsung; hal yang dipakai bersama dipindah ke `components/` atau `lib/`.

## 2. Aturan clean code

- **Route tipis.** File di `routes/` tidak berisi form, state, atau logika bisnis; hanya `createFileRoute`, `head`, loader/guard, dan merender komponen fitur.
- **Satu file, satu tanggung jawab.** Komponen > ~100 baris atau mencampur UI + state + logika harus dipecah.
- **Jangan duplikasi.** Pola yang muncul 2x atau lebih (mis. field form) diekstrak menjadi komponen/hook yang bisa dipakai ulang (`createFormHook` untuk TanStack Form).
- **Validasi di skema Zod**, bukan di komponen. Tipe diturunkan dengan `z.infer`.
- **Tidak ada magic string/angka.** Pindahkan ke `lib/constant.ts` atau konstanta fitur.
- **Tidak ada `console.log`** atau kode mati di hasil akhir.
- **Penamaan:** file `kebab-case`, komponen `PascalCase`, hook `useXxx`, fungsi berupa kata kerja.
- **Aksesibilitas & UX:** error validasi harus tampil (`FieldError`), tombol non-submit memakai `type="button"`, `aria-label` pada tombol ikon.
- **Import** diurutkan: pustaka eksternal, lalu `@/` internal, lalu relatif.
- **Dependensi:** pin versi, hindari `latest`.

## 3. Checklist sebelum selesai

- [ ] Lolos `npm run typecheck`, `npm run lint`, `npm run check`
- [ ] Route tetap tipis, logika ada di `features/`
- [ ] Tidak ada duplikasi pola yang bisa diekstrak
- [ ] Tidak ada `console.log`, import tak terpakai, atau komentar usang
- [ ] `TECH-STACK.md` diperbarui jika ada teknologi baru
