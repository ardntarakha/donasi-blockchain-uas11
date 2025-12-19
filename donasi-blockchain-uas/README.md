# Donasi Blockchain (UAS)

## Isi Folder
- `1-contract/` : smart contract + tempat simpan ABI & address hasil deploy
- `2-web/` : web dApp (React + Vite + ethers)

## Cara Pakai Singkat
1) Deploy `1-contract/DonationCampaign.sol` di Remix (Sepolia)
2) Copy:
   - address contract → `1-contract/address.txt` dan `2-web/.env` (VITE_CONTRACT_ADDRESS)
   - ABI → `1-contract/abi.json` dan `2-web/src/abi/DonationCampaign.json`
3) Jalankan web:
```bash
cd 2-web
npm install
npm run dev
```
