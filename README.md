# Ruang Peduli

Platform Donasi Digital Berbasis Blockchain  
(Ujian Akhir Semester – Blockchain & Distributed Ledger Technology)

---

## 📌 Deskripsi Proyek
Ruang Peduli adalah sebuah aplikasi donasi digital berbasis blockchain yang bertujuan untuk meningkatkan transparansi dan kepercayaan dalam pengelolaan dana donasi. Seluruh transaksi donasi dicatat secara on-chain menggunakan smart contract sehingga dapat diverifikasi secara publik melalui blockchain explorer.

Aplikasi ini dikembangkan sebagai bagian dari proyek Ujian Akhir Semester mata kuliah Blockchain dan Distributed Ledger Technology di Perbanas Institute.

---

## 🚀 Fitur Utama
- Donasi berbasis smart contract menggunakan ETH
- Integrasi wallet MetaMask
- Pencatatan transaksi secara transparan di blockchain
- Admin (owner) dapat melakukan penarikan dana (withdraw)
- Informasi total donasi dan progres target donasi
- Antarmuka web berbasis React

---

## 🛠️ Teknologi yang Digunakan
- Solidity – Pengembangan smart contract
- Remix IDE – Compile dan deploy smart contract
- Ethereum Sepolia Testnet – Jaringan blockchain pengujian
- React.js – Frontend aplikasi web
- ethers.js – Integrasi frontend dengan smart contract
- MetaMask – Wallet untuk transaksi blockchain

---

## 📁 Struktur Folder
ruang-peduli/
├── contract/
│ ├── DonationCampaign.sol
│ ├── abi.json
│ └── address.txt
├── web/
│ ├── src/
│ │ ├── abi/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── lib/
│ │ └── pages/
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
└── README.md

yaml
Salin kode

---

## ⚙️ Cara Menjalankan Aplikasi (Frontend)

1. Masuk ke folder frontend:
   ```bash
   cd web
Install dependency:

bash
Salin kode
npm install
Jalankan aplikasi:

bash
Salin kode
npm run dev
Buka browser:

arduino
Salin kode
http://localhost:5173
📄 Smart Contract
Network: Ethereum Sepolia Testnet

Contract Address:

Salin kode
0x2b0422747d3c2Db827BeF0dADE47B80791a023c0
Smart contract berfungsi untuk:

Menerima donasi ETH

Mencatat total donasi

Mengizinkan owner melakukan withdraw dana

🎥 Video Demo
Video demonstrasi aplikasi:
👉 [(isi link Google Drive / YouTube di sin](https://drive.google.com/file/d/1O1Cf8Ad382_pCbs55rwZ-WxqfckkvCum/view?usp=sharing)

🔗 Verifikasi Transaksi
Seluruh transaksi dapat diverifikasi melalui Ethereum Explorer:
👉 [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/tx/0x3f974bdb39ec48e7117c263981e81c13b3ce463dacd08dc6e2786271f157b423)
