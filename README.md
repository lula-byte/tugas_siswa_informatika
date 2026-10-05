# DATABASE TUGAS SISWA SMP IT INSAN MULIA MAOS

Aplikasi pengumpulan tugas siswa (gambar, audio, video, dokumen, PDF, maksimal 10 MB).

- Halaman siswa: `index.html` (nama, kelas, judul/keterangan, upload file)
- Halaman guru: `guru.html` (login, lihat, unduh, hapus, cetak)
- Database: file tersimpan di **Google Drive**, datanya di **Google Sheets**, dihubungkan lewat **Google Apps Script** (gratis)
- Tampilan: GitHub Pages (gratis)

## Kenapa tidak memakai GitHub sebagai database?

GitHub Pages hanya hosting statis. Untuk menyimpan file dari siswa lewat GitHub, token GitHub harus ditaruh di kode website, sehingga siapa pun bisa mencurinya dan merusak repositori. Karena itu GitHub dipakai untuk **tampilan**, dan Google Drive untuk **penyimpanan**.

## Langkah 1: Buat backend di Google Apps Script

1. Buka https://script.google.com lalu klik **Proyek baru**.
2. Hapus isi `Code.gs` bawaan, lalu tempel seluruh isi file **Code.gs** dari paket ini.
3. Ganti `ADMIN_USER` dan `ADMIN_PASS` (login guru). Klik **Simpan**.
4. Pilih fungsi **setup** di bagian atas editor, lalu klik **Jalankan**. Beri izin akses Google Drive dan Sheets saat diminta. Ini membuat folder dan spreadsheet otomatis di Drive Anda.

## Langkah 2: Terbitkan sebagai Web app

1. Klik **Deploy > Deployment baru**.
2. Jenis: **Aplikasi web**.
3. Jalankan sebagai: **Saya**. Siapa yang memiliki akses: **Siapa saja**.
4. Klik **Deploy**, lalu salin **URL aplikasi web** (berakhiran `/exec`).

## Langkah 3: Hubungkan ke tampilan

Buka `config.js`, tempel URL tadi:

```js
API_URL: "https://script.google.com/macros/s/XXXXXXXX/exec",
```

## Langkah 4: Upload ke GitHub

1. Buat repositori baru di GitHub, misalnya `database-tugas-siswa`.
2. Upload semua file di folder ini: `index.html`, `guru.html`, `style.css`, `app.js`, `config.js`, `README.md`.
3. Buka **Settings > Pages**. Source: **Deploy from a branch**, branch **main**, folder **/ (root)**, lalu **Save**.
4. Tunggu sekitar 1 menit. Alamatnya: `https://NAMA-GITHUB-ANDA.github.io/database-tugas-siswa/`

Bagikan alamat itu kepada siswa. Halaman guru ada di `.../guru.html`.

## Catatan penting

- **Jangan upload `Code.gs` ke GitHub** karena berisi password guru. File itu hanya untuk ditempel di Apps Script.
- Jika `Code.gs` diubah, buat versi baru: **Deploy > Kelola deployment > Edit (ikon pensil) > Versi baru > Deploy**. URL tetap sama.
- File di Drive diatur "siapa saja yang memiliki link dapat melihat" agar pratinjau di halaman guru berfungsi. Link-nya acak dan tidak muncul di halaman siswa.
- Kapasitas Google Drive gratis 15 GB. Tugas yang dihapus dari halaman guru masuk ke Sampah Drive.
- Data lengkap juga bisa dilihat langsung di Google Sheets (dibuat otomatis di folder Drive tadi).
- Tombol **Cetak** di halaman guru menyediakan pilihan: sesuai filter, semua data, atau hanya yang dicentang; urutan; serta arah kertas. Hasil cetak memuat judul database dan kolom tanda tangan guru.
