# Diagram: Refaktor Form Login

Pelengkap [refaktor-form-login.md](./refaktor-form-login.md). Untuk melihat diagram
sebagai gambar di VSCode, buka Markdown Preview (`Ctrl+Shift+V`). Diagram Mermaid
didukung bawaan di VSCode versi terbaru; jika tidak tampil, pasang ekstensi
"Markdown Preview Mermaid Support".

---

## 1. Siapa mengimpor siapa

Panah berarti "diimpor oleh". Semua panah searah ke bawah, tidak ada yang melingkar.

```mermaid
flowchart TD
    CTX["hooks/form-context.ts<br/>fieldContext, formContext, useFieldContext"]
    TF["components/fields/text-field.tsx<br/>TextField"]
    PF["components/fields/password-field.tsx<br/>PasswordField"]
    UAF["hooks/use-app-form.ts<br/>createFormHook → useAppForm"]
    SCH["schemas/auth.ts<br/>loginSchema"]
    LF["components/login-form.tsx"]

    CTX -->|useFieldContext| TF
    CTX -->|useFieldContext| PF
    CTX -->|fieldContext, formContext| UAF
    TF -->|fieldComponents| UAF
    PF -->|fieldComponents| UAF
    UAF -->|useAppForm| LF
    SCH -->|validators| LF
```

### Kenapa `form-context.ts` dipisah?

Jika context ditaruh di `use-app-form.ts`, terjadi impor melingkar:

```mermaid
flowchart LR
    UAF["use-app-form.ts"] -->|impor komponen field| TF["text-field.tsx"]
    TF -->|impor context| UAF
    style UAF fill:#fdd,stroke:#c00
    style TF fill:#fdd,stroke:#c00
```

---

## 2. Alur data saat form berjalan

```mermaid
flowchart TD
    A["login-form.tsx<br/>useAppForm({ defaultValues, validators, onSubmit })"]
    B["Objek form (TanStack Form)"]
    C["&lt;form.AppField name='username'&gt;<br/>membuat objek field:<br/>value, errors, handleChange, handleBlur"]
    D[("fieldContext<br/>jalur tersembunyi, bukan props")]
    E["&lt;field.TextField label=... /&gt;<br/>hanya menerima label, placeholder, autoComplete"]
    F["TextField<br/>1. useFieldContext()<br/>2. hitung isInvalid<br/>3. render Field + Input + FieldError"]
    G{{"User mengetik / blur"}}
    H["field.handleChange / handleBlur"]
    I["State form berubah → render ulang"]
    J{{"Klik Masuk (submit)"}}
    K{"loginSchema lolos?"}
    L["Error tampil di FieldError"]
    M["onSubmit dijalankan"]

    A --> B --> C
    C -->|menaruh field ke| D
    C --> E
    E --> F
    D -.->|useFieldContext| F
    F --> G --> H --> I --> F
    F --> J --> K
    K -->|tidak| L --> F
    K -->|ya| M
```

Poin kuncinya: garis putus-putus. `login-form` tidak mengirim nilai, error, atau
handler lewat props. `TextField` mengambilnya sendiri dari context.

---

## 3. Sebelum dan sesudah

```mermaid
flowchart LR
    subgraph Sebelum["Sebelum: login-form.tsx (116 baris)"]
        direction TB
        S1["useForm"]
        S2["useState(showPassword)"]
        S3["blok username ±25 baris"]
        S4["blok password ±25 baris"]
    end

    subgraph Sesudah["Sesudah: login-form.tsx (56 baris)"]
        direction TB
        N1["useAppForm"]
        N2["AppField username"]
        N3["AppField password"]
    end

    N2 --> TF["TextField<br/>fields/text-field.tsx"]
    N3 --> PF["PasswordField<br/>fields/password-field.tsx<br/>+ useState(showPassword)"]

    Sebelum ==>|refaktor| Sesudah
```

---

## 4. Peran tiap file

| File | Peran |
| --- | --- |
| `hooks/form-context.ts` | Membuat "kabel" penyambung form ke field |
| `components/fields/text-field.tsx` | Tampilan field teks, mengambil data lewat context |
| `components/fields/password-field.tsx` | Sama, ditambah tombol mata dan state `showPassword` lokal |
| `hooks/use-app-form.ts` | Mendaftarkan field ke form, menghasilkan `useAppForm` |
| `components/login-form.tsx` | Memakai `useAppForm` dan merangkai field |
