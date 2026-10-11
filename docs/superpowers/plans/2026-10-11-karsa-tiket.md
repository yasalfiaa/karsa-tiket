# Karsa Tiket Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web tiket event responsif mobile (Karsa Tiket) dengan React, Cloud Firestore modular SDK, palet Rose Quartz & Serenity, validasi kuota anti-overbooking menggunakan `runTransaction`, serta modul Rekap terintegrasi.

**Architecture:** Menggunakan Modular Feature-based Architecture with Clean Service Layer. Setiap modul (`event`, `pembeli`, `tiket`, `rekap`) memiliki komponen antarmuka mandiri dan service layer murni yang mengenkapsulasi seluruh pemanggilan Firestore Modular SDK, transaksi atomik, dan aturan validasi bisnis.

**Tech Stack:** React 18 / 19 (Vite), Cloud Firestore (Modular SDK v9+), Lucide React (ikon), CSS Variables (Design System Rose Quartz & Serenity), Vitest / React Testing Library.

**Spec:** [docs/superpowers/specs/2026-10-11-karsa-tiket-design.md](file:///d:/Bootcamp/Karsa%20Tiket/docs/superpowers/specs/2026-10-11-karsa-tiket-design.md)

## Global Constraints

- Platform: Mobile-first responsive web application.
- State Machine Tiket: Transisi ketat: `menunggu_bayar` -> `lunas` -> `hadir`. Pembatalan HANYA sah dari status `menunggu_bayar` dengan pengembalian kuota atomik via `runTransaction`. Tiket `lunas` TIDAK BISA dibatalkan.
- Kuota Atomik: Pembuatan tiket wajib memverifikasi sisa kuota dan meng-increment `tiket_terjual` di dalam Firestore `runTransaction`.
- Document ID Pembeli: Menggunakan nomor WhatsApp yang dinormalisasi ke format `628xxx` dan bersifat read-only saat edit.
- Integritas Relasional: Prevent Delete diterapkan — Event dengan `tiket_terjual > 0` dan Pembeli dengan tiket aktif dilarang dihapus.
- Desain Visual: Menggunakan font *Plus Jakarta Sans*, token Rose Quartz (`#F7CAC9`), Serenity Deep (`#557BB5`), dan 4 warna pill status yang kontras.

## Review Focus

1. **Overbooking Race Condition**: Pemesanan tiket melebihi sisa kuota saat transaksi berlangsung harus dibatalkan aman via `runTransaction`.
2. **Kalkulasi Pendapatan Rekap**: Tiket berstatus `menunggu_bayar` dan `dibatalkan` tidak boleh masuk perhitungan pendapatan.
3. **Format Email & Nomor WA**: Input email tanpa `@` dan nomor WA non-angka/kurang dari 10 digit harus ditolak oleh validasi form.
4. **Proteksi Hapus Event Terjual**: Menghapus event yang sudah memiliki tiket terjual harus dicegah dan memunculkan notifikasi peringatan.
5. **Kunci Nomor WA saat Edit Pembeli**: Formulir edit pembeli tidak boleh mengizinkan perubahan nomor WhatsApp (Document ID).

---

### Task 1: Inisialisasi Proyek Vite React & Design System Tokens

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`
- Create: `src/styles/tokens.css`, `src/styles/index.css`
- Create: `src/main.jsx`, `src/App.jsx`

**Interfaces:**
- Produces: CSS custom properties (`--color-primary`, `--color-accent`, `--color-bg`, dll.) dan font *Plus Jakarta Sans*.

- [ ] **Step 1: Setup project scaffolding Vite + React**
Scaffold aplikasi React dengan Vite di root direktori atau buat konfigurasi Vite dan `package.json` yang memuat `react`, `react-dom`, `lucide-react`.

- [ ] **Step 2: Pasang Design System Tokens & Base CSS**
Definisikan variabel CSS palet Rose Quartz & Serenity di `src/styles/tokens.css` dan import font Google *Plus Jakarta Sans* di `index.html`.

- [ ] **Step 3: Verifikasi build dev server**
Jalankan build verifikasi untuk memastikan tidak ada error syntax.

- [ ] **Step 4: Commit**
`git add . && git commit -m "feat: initialize Vite React app with Rose Quartz & Serenity design tokens"`

---

### Task 2: Konfigurasi Firebase Modular SDK & Firestore Rules

**Files:**
- Create: `src/services/firebase.js`
- Create: `firestore.rules`
- Create: `.env.example`, `.env`

**Interfaces:**
- Produces: `db` Firestore instance dari `getFirestore(app)`.

- [ ] **Step 1: Buat konfigurasi Firebase modular client**
Di `src/services/firebase.js`, inisialisasi Firebase App dan ekspor `db` menggunakan Firebase Web SDK v9+ modular (`initializeApp`, `getFirestore`).

- [ ] **Step 2: Tulis berkas firestore.rules**
Tulis aturan keamanan Firestore untuk koleksi `event`, `pembeli`, dan `tiket` yang melarang nilai negatif dan membatasi izin baca-tulis sesuai spesifikasi PRD.

- [ ] **Step 3: Commit**
`git add src/services/firebase.js firestore.rules .env.example && git commit -m "feat: add Firebase modular client config and Firestore security rules"`

---

### Task 3: Komponen Antarmuka Bersama (Common UI & Toast Context)

**Files:**
- Create: `src/contexts/ToastContext.jsx`
- Create: `src/components/common/Toast.jsx`
- Create: `src/components/common/Button.jsx`
- Create: `src/components/common/Modal.jsx`
- Create: `src/components/common/ConfirmDialog.jsx`
- Create: `src/components/common/Badge.jsx`
- Create: `src/components/common/Skeleton.jsx`
- Create: `src/components/common/BottomNav.jsx`
- Create: `src/components/common/TopNavbar.jsx`

**Interfaces:**
- Produces: `useToast()` hook untuk trigger notifikasi sukses/error.
- Produces: Komponen modal, tombol, badge status, dan navigasi bottom bar.

- [ ] **Step 1: Implementasi ToastContext & Toast component**
Buat provider notifikasi mengambang dengan varian `success`, `error`, dan `warning`.

- [ ] **Step 2: Implementasi Reusable UI components**
Buat Button dengan varian primary/secondary/danger, Modal popup responsif, ConfirmDialog untuk aksi destruktif, dan Badge pill status.

- [ ] **Step 3: Implementasi BottomNav & TopNavbar**
Buat navigasi 4 menu: Event, Pembeli, Tiket, Rekap dengan indikator aktif Rose Quartz/Serenity.

- [ ] **Step 4: Commit**
`git add src/contexts/ src/components/common/ && git commit -m "feat: implement reusable UI components and Toast notification system"`

---

### Task 4: Modul Event (Service & UI)

**Files:**
- Create: `src/services/eventService.js`
- Create: `src/features/event/EventCard.jsx`
- Create: `src/features/event/EventList.jsx`
- Create: `src/features/event/EventFormModal.jsx`

**Interfaces:**
- Produces: `getEvents()`, `createEvent()`, `updateEvent()`, `deleteEvent()`.

- [ ] **Step 1: Implementasi eventService.js**
Logika CRUD Firestore dengan validasi: harga >= 0, kuota >= 1, update kuota tidak boleh < tiket_terjual, dan deleteEvent dicegah jika tiket_terjual > 0.

- [ ] **Step 2: Implementasi EventCard & EventList**
Tampilkan nama event, tanggal, lokasi, harga (Rp), sisa kuota, badge "Habis", loading skeleton, dan empty state.

- [ ] **Step 3: Implementasi EventFormModal**
Formulir tambah/edit event dengan date picker dan validasi live.

- [ ] **Step 4: Commit**
`git add src/services/eventService.js src/features/event/ && git commit -m "feat: implement Event module with quota validation and card UI"`

---

### Task 5: Modul Pembeli (Service & UI)

**Files:**
- Create: `src/utils/formatter.js`
- Create: `src/services/pembeliService.js`
- Create: `src/features/pembeli/PembeliList.jsx`
- Create: `src/features/pembeli/PembeliSearch.jsx`
- Create: `src/features/pembeli/PembeliFormModal.jsx`

**Interfaces:**
- Produces: `getPembeliList()`, `createPembeli()`, `updatePembeli()`, `deletePembeli()`.

- [ ] **Step 1: Utility formatter & normalisasi nomor WhatsApp**
Fungsi `normalizeWhatsApp(no)` (ubah prefix 08/62 jadi 628xxx) dan validasi email (`@`).

- [ ] **Step 2: Implementasi pembeliService.js**
Gunakan `noWhatsapp` sebagai Doc ID (`setDoc`). Cek keberadaan nomor untuk mencegah overwrite data. Proteksi `deletePembeli` jika masih memiliki tiket aktif.

- [ ] **Step 3: Implementasi PembeliList, Search, & FormModal**
Daftar pembeli dengan avatar inisial, tautan WhatsApp langsung (`wa.me`), filter search nama/nomor, dan modal form dengan nomor WA terkunci saat edit.

- [ ] **Step 4: Commit**
`git add src/utils/ src/services/pembeliService.js src/features/pembeli/ && git commit -m "feat: implement Pembeli module with WhatsApp normalization and search"`

---

### Task 6: Modul Tiket (Atomic Transaction, State Machine & UI)

**Files:**
- Create: `src/services/tiketService.js`
- Create: `src/features/tiket/TiketCard.jsx`
- Create: `src/features/tiket/TiketList.jsx`
- Create: `src/features/tiket/TiketTabs.jsx`
- Create: `src/features/tiket/TiketCreateModal.jsx`

**Interfaces:**
- Produces: `getTiketList()`, `createTiketTransaction()`, `updateTiketStatus()`.

- [ ] **Step 1: Implementasi tiketService.js dengan runTransaction**
`createTiketTransaction(data)`: Periksa sisa kuota atomik di Firestore transaction, tulis tiket baru (`menunggu_bayar`), tambah `event.tiket_terjual`.
`updateTiketStatus(tiketId, newStatus)`: Validasi transisi state ketat. Jika pembatalan dari `menunggu_bayar` -> `dibatalkan`, kurangi `tiket_terjual` atomik via `runTransaction`.

- [ ] **Step 2: Implementasi TiketTabs & TiketCard**
Desain boarding pass mini dengan counter status, tombol aksi "Konfirmasi Lunas" dan "Batalkan" untuk status `menunggu_bayar`, serta tombol "Check-in" untuk status `lunas`.

- [ ] **Step 3: Implementasi TiketCreateModal**
Dropdown pilihan event aktif (yang memiliki sisa kuota), dropdown pembeli, input jumlah (1-5), dan kalkulasi total harga otomatis.

- [ ] **Step 4: Commit**
`git add src/services/tiketService.js src/features/tiket/ && git commit -m "feat: implement Tiket module with atomic runTransaction and state machine UI"`

---

### Task 7: Modul Rekapitulasi (Service, Metrik & UI)

**Files:**
- Create: `src/services/rekapService.js`
- Create: `src/features/rekap/RekapView.jsx`
- Create: `src/features/rekap/RekapMetrics.jsx`
- Create: `src/features/rekap/RekapProgressBar.jsx`
- Create: `src/features/rekap/RekapStatusBreakdown.jsx`
- Create: `src/features/rekap/RekapTiketTable.jsx`

**Interfaces:**
- Produces: `getRekapEvent(eventId)`.

- [ ] **Step 1: Implementasi rekapService.js**
Kalkulasi akurat: Pendapatan hanya dari tiket `lunas` dan `hadir`. Hitung rasio kehadiran dan breakdown per 4 status tiket.

- [ ] **Step 2: Implementasi RekapView & komponen visual metrik**
Selector event, StatCard pendapatan/terjual/sisa kuota/hadir, Progress Bar keterisian kapasitas, 4 card status breakdown, dan tabel riwayat tiket event terkait.

- [ ] **Step 3: Commit**
`git add src/services/rekapService.js src/features/rekap/ && git commit -m "feat: implement comprehensive Rekap module with metrics, progress bar, and ticket table"`

---

### Task 8: Integrasi Aplikasi Utama & Pengujian Uji Tembus (Boundary Testing)

**Files:**
- Modify: `src/App.jsx`
- Create: `tests/boundary-tests.test.js` (atau verifikasi end-to-end via script uji)

- [ ] **Step 1: Hubungkan navigasi 4 modul di App.jsx**
Integrasikan state modul aktif (Event, Pembeli, Tiket, Rekap) dengan BottomNav dan ToastContext.

- [ ] **Step 2: Eksekusi Uji 6 Masukan Tidak Sah (Boundary Test)**
Verifikasi: Form kosong, tipe salah, harga/kuota negatif, kuota diturunkan < terjual, order tiket > 5 / > kuota, transisi status ilegal.

- [ ] **Step 3: Build verifikasi produksi**
Jalankan `npm run build` untuk memastikan bundling Netlify bebas galat.

- [ ] **Step 4: Commit**
`git add . && git commit -m "feat: finalize app integration and verify production build"`
