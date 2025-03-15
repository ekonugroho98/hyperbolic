# Chat API Message Sender

Script ini adalah aplikasi Node.js yang dirancang untuk mengirim pesan ke API Hyperbolic (`https://api.hyperbolic.xyz/v1/chat/completions`) secara asinkronus. Script ini memilih model AI secara acak dari daftar yang telah ditentukan, mengirimkan pesan dari file `message.json`, dan menangani respons dengan jeda 5 detik antara setiap permintaan. Token API dikelola secara aman menggunakan file `.env`.

## Fitur
- Memilih model AI secara acak dari daftar yang telah ditentukan.
- Mengirim pesan dari file JSON secara berurutan.
- Penanganan kesalahan untuk setiap permintaan API.
- Pengelolaan token API yang aman melalui variabel lingkungan.

## Prasyarat
Sebelum memulai, pastikan Anda memiliki:
- [Node.js](https://nodejs.org/) (versi 14 atau lebih tinggi)
- [Git](https://git-scm.com/)
- Akun Hyperbolic dan token API (dapat diperoleh dari dashboard Hyperbolic)
- Terminal atau command line interface

## Cara Mendapatkan Kode
### Jika Anda Sudah Memiliki Repository Lokal
Untuk memperbarui kode dari GitHub:
1. Buka terminal di direktori proyek Anda.
2. Jalankan:
   ```bash
   git pull origin master