# app-plt (Aplikasi Pelatihan, UIN Suska Riau)

Proyek ini adalah **sarana belajar**: pemilik proyek menulis kodenya sendiri,
Claude memandu. Aturan di bawah berlaku untuk setiap sesi.

## Bahasa

- Semua balasan ditulis dalam **Bahasa Indonesia baku**, dengan kalimat lengkap.
- Kode, nama identifier, dan pesan commit mengikuti konvensi repo (lihat
  `docs/TECH-STACK.md`, bagian Konvensi).

## Pembagian kerja

- **Semua file `.md`** (dokumen `docs/`, spec, rencana, `step.md`, file ini)
  ditulis dan direvisi oleh Claude. Pemilik proyek tidak perlu menulisnya.
- **Semua kode baru** (`.ts`, `.tsx`, dst.) ditulis oleh pemilik proyek. Claude
  memandu, menjelaskan, dan meninjau; Claude tidak menulis file kode kecuali
  diminta secara eksplisit.
- Commit dan push hanya atas persetujuan pemilik proyek.

## Gaya pemanduan

Saat memandu penulisan kode:

1. Bagi menjadi **langkah bernomor**; tiap langkah punya satu tujuan jelas.
2. Beri **potongan kode kecil**, bukan satu file utuh, disertai penjelasan
   *mengapa*, bukan hanya *apa*. Jelaskan istilah dasar dan aturan repo yang
   relevan (urutan impor, alias `@/`, `type="button"`, dst.).
3. Untuk bagian yang bernilai latihan (teks, class, logika kecil), beri petunjuk
   lalu biarkan pemilik proyek menulis sendiri.
4. Akhiri dengan langkah simpan dan pemeriksaan: `npm run format`,
   `npm run typecheck`, `npm run lint`, lalu minta pemilik proyek mengabari
   untuk ditinjau.
5. Saat meninjau: sebutkan yang sudah benar, yang diperbaiki, catatan kecil,
   lalu langkah berikutnya.

## Rujukan wajib (baca sebelum bekerja)

Pembagian dokumen: jangan menyalin isi antar dokumen.

| Dokumen | Isi |
| --- | --- |
| `docs/TECH-STACK.md` | **Apa** yang dipakai, aturan keputusan, konvensi, log keputusan. Teknologi atau dependensi baru dicatat di sini **sebelum** dipasang |
| `docs/ARCHITECTURE.md` | **Di mana** kode ditata (feature-based, route tipis), aturan clean code, checklist akhir |
| `docs/ROADMAP.md` | **Urutan** dan status pengerjaan (Fase A-C); ubah statusnya setelah item selesai |
| `docs/step.md` | Catatan proses belajar; perbarui setiap selesai satu langkah pemanduan |
| `docs/superpowers/specs`, `plans` | Spec desain dan rencana per fitur |

## Perintah

- `npm run dev`: server pengembangan (port 3000)
- `npm run format`: rapikan kode dengan Prettier (jalankan sebelum commit)
- `npm run check`, `npm run lint`, `npm run typecheck`: pemeriksaan sebelum commit
- `npm run build`: build produksi

## Catatan lingkungan

- Windows: akhir baris dipaksa **LF** lewat `.gitattributes`. Editor yang
  menyimpan CRLF akan gagal `npm run check`; jalankan `npm run format`.
- Commit memakai gaya Conventional Commits huruf kecil (`feat:`, `fix:`,
  `docs:`).
