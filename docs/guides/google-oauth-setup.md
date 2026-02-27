# Panduan Setup Google OAuth untuk Supabase

Berikut adalah langkah-langkah detail untuk mengaktifkan Google OAuth pada aplikasi Qiroasro menggunakan Supabase dan Google Cloud Console:

## 1. Setup Google Cloud Console (Mendapatkan Credentials)

1. **Buka Google Cloud Console:** Kunjungi [console.cloud.google.com](https://console.cloud.google.com/).
2. **Buat Project Baru:** Klik dropdown project di bagian atas dan pilih **New Project**. Beri nama (misal: "Qiroasro Auth") dan klik Create. Pastikan Anda telah memilih project tersebut setelah dibuat.
3. **Konfigurasi OAuth Consent Screen:**
   - Navigasi ke menu **APIs & Services > OAuth consent screen**.
   - Pilih **External** untuk tipe user, lalu klik **Create**.
   - Isi informasi aplikasi yang wajib: App name, User support email, dan Developer contact information.
   - Pada bagian **Authorized domains**, tambahkan App URL Anda serta Custom Domain dari project Supabase Anda (bisa didapat di dashboard Supabase: `[PROJECT-REF].supabase.co`).
   - Lanjut ke tahap "Scopes", Anda tidak perlu menambahkan scope khusus (secara default `email`, `profile`, dan `openid` sudah cukup).
   - Simpan dan lanjutkan sampai selesai. Tambahkan email test accounts jika berencana mencoba di mode testing sebelum publish.
4. **Buat OAuth Client ID & Secret:**
   - Navigasi ke menu **APIs & Services > Credentials**.
   - Klik **+ CREATE CREDENTIALS** di bagian atas dan pilih **OAuth client ID**.
   - Pilih **Web application** sebagai Application type. Beri nama (misal: "Supabase Login").
   - Pada bagian **Authorized JavaScript origins**, tambahkan:
     - `http://localhost:3000` (untuk development lokal Next.js)
     - `https://[PROJECT-REF].supabase.co` (URL project Supabase Anda)
     - URL Homepage Production Anda kelak.
   - Pada bagian **Authorized redirect URIs**, tambahkan URL callback dari Supabase. Formatnya:
     `https://[PROJECT-REF].supabase.co/auth/v1/callback`
   - Klik **Create**.
5. **Simpan Credentials:** Sebuah pop-up akan muncul menunjukan **Client ID** dan **Client Secret**. Jangan sampai hilang, copy dan simpan kedua kunci ini untuk diinput ke Supabase.

## 2. Setup Supabase Dashboard (Enable Google Auth)

1. **Buka Supabase Dashboard:** Login ke Supabase dan pilih project "Qiroasro".
2. **Masuk ke Authentication Settings:** Pilih menu **Authentication > Providers** (atau Sign In / Up > Auth Providers).
3. **Pilih Google:** Temukan "Google" di daftar provider, lalu klik untuk meng-expand.
4. **Enable & Input Credentials:**
   - Aktifkan toggle **Enable Sign in with Google**.
   - Paste **Client ID** yang didapat dari Google Cloud Console ke kolom *Client ID*.
   - Paste **Client Secret** yang didapat dari Google Cloud Console ke kolom *Client Secret*.
   - Copy URL Callback *(URL yang sama yang Anda masukkan di "Authorized redirect URIs" sebelumnya)* untuk memastikannya sama 100%.
   - (Opsional) Jika Anda mengembangkan aplikasi mobile dengan Capacitor/React Native di masa depan, matikan atau sesuaikan *Skip nonce checks* sesuai kebutuhan Anda.
5. **Save Changes:** Klik tombol **Save**.

## 3. Menambahkan Environment Variables Lokal

Untuk testing auth Google dari UI aplikasi lokal menggunakan Supabase SSR, kode Anda sudah akan menggunakan URL Callback SSR yang ada di `src/app/[locale]/auth/callback/route.ts` (nantinya perlu dibuat) atau setup redirect otomatis via metode `signInWithOAuth` Supabase di klien.

*Catatan tambahan:* Jika Anda mengalami masalah dengan OAuth flow di *localhost*, pastikan URL redirect ketika memanggil `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'http://localhost:3000/auth/callback' } })` cocok dan masuk dalam daftar origin aplikasi Anda.

---
Dengan mengikuti instruksi di atas, aplikasi kini siap menghubungkan fitur social login (Google) ke Supabase Auth.
