export default function About() {
  return (
    <div className="container section">
      <h2 style={{ marginTop: 0 }}>Tentang Ruang Peduli</h2>

      <p style={{ lineHeight: 1.9, maxWidth: 900 }}>
        <b>Ruang Peduli</b> adalah sebuah platform donasi digital berbasis teknologi
        blockchain yang dirancang untuk meningkatkan transparansi, akuntabilitas,
        dan kepercayaan dalam proses penggalangan dana. Platform ini dikembangkan
        sebagai bagian dari proyek Ujian Akhir Semester (UAS) dengan tujuan
        menerapkan konsep smart contract dalam kasus nyata, khususnya pada sistem
        donasi sosial.
      </p>

      <p style={{ lineHeight: 1.9, maxWidth: 900 }}>
        Pada sistem donasi konvensional, donatur sering kali tidak memiliki
        visibilitas yang jelas mengenai alur dana yang mereka berikan. Hal ini dapat
        menimbulkan keraguan terkait transparansi dan penggunaan dana. Melalui
        teknologi blockchain, Ruang Peduli menghadirkan solusi di mana setiap
        transaksi donasi dicatat secara permanen (immutable) di dalam blockchain
        dan dapat diverifikasi secara publik melalui blockchain explorer.
      </p>

      <p style={{ lineHeight: 1.9, maxWidth: 900 }}>
        Setiap donasi yang dilakukan oleh pengguna akan dikirim langsung ke smart
        contract, bukan ke rekening pribadi. Smart contract tersebut berfungsi
        sebagai perantara yang menyimpan dana secara aman dan mencatat seluruh
        transaksi donasi secara otomatis. Dengan demikian, donatur dapat memeriksa
        bukti transaksi, jumlah dana terkumpul, serta progres pencapaian target
        donasi secara real-time.
      </p>

      <p style={{ lineHeight: 1.9, maxWidth: 900 }}>
        Platform ini juga memanfaatkan dompet digital MetaMask sebagai media
        autentikasi pengguna dan sarana transaksi. Penggunaan MetaMask memungkinkan
        pengguna untuk berinteraksi langsung dengan smart contract tanpa perlu
        membuat akun konvensional, sehingga sistem menjadi lebih terdesentralisasi
        dan aman. Saat ini, Ruang Peduli dijalankan pada jaringan uji coba (testnet)
        Sepolia untuk keperluan pengembangan dan demonstrasi akademik.
      </p>

      <p style={{ lineHeight: 1.9, maxWidth: 900 }}>
        Dengan adanya Ruang Peduli, diharapkan masyarakat dapat memahami bagaimana
        teknologi blockchain dapat diterapkan pada sektor sosial, khususnya dalam
        menciptakan sistem donasi yang lebih transparan, terpercaya, dan efisien.
        Ke depannya, konsep ini dapat dikembangkan lebih lanjut untuk mendukung
        berbagai kampanye sosial dengan skala yang lebih besar.
      </p>

      {/* BOX TEKNOLOGI (PUTIH + TEKS HITAM) */}
      <div className="techBox" style={{ maxWidth: 900, marginTop: 28 }}>
        <h3>Teknologi yang Digunakan</h3>
        <ul>
          <li>
            <b>Solidity & Smart Contract</b> – Digunakan untuk mengelola logika donasi
            secara on-chain, termasuk pencatatan dana dan hak penarikan oleh admin.
          </li>
          <li>
            <b>Remix IDE</b> – Digunakan sebagai lingkungan pengembangan dan deployment
            smart contract ke jaringan blockchain.
          </li>
          <li>
            <b>MetaMask</b> – Digunakan sebagai dompet digital untuk menghubungkan
            pengguna dengan aplikasi dan menandatangani transaksi.
          </li>
          <li>
            <b>React & ethers.js</b> – Digunakan untuk membangun antarmuka web dan
            menghubungkan frontend dengan smart contract.
          </li>
          <li>
            <b>Blockchain Sepolia Testnet</b> – Digunakan sebagai jaringan uji coba
            untuk simulasi transaksi donasi.
          </li>
        </ul>
      </div>
    </div>
  );
}
