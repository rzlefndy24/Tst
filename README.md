# cgttezt

Website bridge untuk klaim token dari L2 ke L1 (Linea) berbasis wallet EVM.  
**Langsung connect ke MetaMask, Rabby, dsb — tanpa WalletConnect, tanpa file .env, tanpa rainbowkit.**

---

## Fitur

- Connect wallet langsung (MetaMask/Rabby/dsb, browser extension)
- Input Message Hash bridge
- Klaim token ke wallet user jika status sudah claimable
- Siap deploy di Vercel (tanpa backend/server-side secrets, tanpa edit file apapun)

---

## Cara Instal & Deploy

1. **Buat repo baru (misal: cgttezt) di GitHub Anda.**
2. **Copy-paste semua file dari project ini ke repo Anda.**
3. **Install dependencies**
   ```
   npm install
   ```
4. **Jalankan lokal**
   ```
   npm run dev
   ```
5. **Deploy ke Vercel**
   - Import repo ke Vercel (https://vercel.com/import)
   - Deploy, selesai! Tidak perlu edit file apapun.

---

## Penggunaan

1. Connect wallet  
2. Masukkan `message hash` dari bridge  
3. Klik **Claim**  
4. Jika status sudah claimable, wallet Anda akan menandatangani transaksi klaim

---

## Catatan

- Semua logic berjalan di client-side, tidak ada private key/server-side secret.
- Anda bisa menambah fitur lain (cek status, list history, dsb).

---

## License

MIT
