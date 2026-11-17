# Dashboard Manajemen Proyek — PT 3Plus Indonesia

Dashboard internal tim 3Plus (peta proyek, daftar proyek + ekspor Excel, linimasa/Gantt, CMS Admin).
Alamat: **https://dashboard.3plus.id** · Data: Firebase Firestore · Login: Firebase Authentication (email + kata sandi).

## Siapa yang bisa masuk
- **Pemilik** (selalu Direktur): `3plus.id@gmail.com`, `info@3plusdesign.com`
  (ubah di `OWNER_EMAILS` pada `src/lib/firebase.ts` **dan** di `firestore.rules`).
- **Anggota tim**: Direktur menambahkan email + peran di *CMS Admin > Tim & PIC*. Orang itu lalu
  klik "Buat akun" di halaman login dengan email yang sama dan memverifikasi emailnya.
- Peran: Direktur (semua akses + CMS Admin), Project Manager (lihat + ubah proyek),
  Representative Associate (lihat saja).

## Setup sekali di Firebase Console
Project: `gen-lang-client-0983401086` (https://console.firebase.google.com)
1. Authentication > Get started > Sign-in method > **Email/Password** > Enable > Save.
2. Authentication > Settings > Authorized domains > Add `dashboard.3plus.id`.
3. Firestore Database > pilih database `ai-studio-pt3plusindonesia-…` > **Rules** >
   tempel isi `firestore.rules` > Publish.

## Deploy (Cloudflare Pages)
Build command `npm run build`, output `dist`, custom domain `dashboard.3plus.id`.

## Jalankan lokal
`npm install` lalu `npm run dev` (http://localhost:3000).
