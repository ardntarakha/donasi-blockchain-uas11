import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { getContractRead, getContractWrite } from "../lib/ethers";

export default function Admin() {
  const [account, setAccount] = useState("");
  const [owner, setOwner] = useState("");
  const [to, setTo] = useState("");
  const [eth, setEth] = useState("0.01");
  const [balanceWei, setBalanceWei] = useState(0n);
  const [loading, setLoading] = useState(false);

  const isOwner = useMemo(() => {
    if (!account || !owner) return false;
    return account.toLowerCase() === owner.toLowerCase();
  }, [account, owner]);

  async function connectWallet() {
    if (!window.ethereum) return alert("MetaMask belum terpasang");
    const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accs?.[0] || "");
  }

  async function loadAdminInfo() {
    try {
      const { contract } = getContractRead();
      const [o, bal] = await Promise.all([contract.owner(), contract.contractBalance()]);
      setOwner(o);
      setBalanceWei(bal);
      // default tujuan withdraw: owner
      if (!to) setTo(o);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadAdminInfo();
    if (!window.ethereum) return;

    window.ethereum.request({ method: "eth_accounts" }).then((accs) => {
      setAccount(accs?.[0] || "");
    });

    const handler = (accs) => setAccount(accs?.[0] || "");
    window.ethereum.on("accountsChanged", handler);
    return () => window.ethereum.removeListener("accountsChanged", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function withdraw() {
    try {
      if (!window.ethereum) return alert("MetaMask belum terpasang");

      if (!account) {
        await connectWallet();
        return;
      }

      if (!isOwner) {
        return alert(
          `Akun kamu bukan OWNER kontrak.\n\nOwner: ${owner}\nAkun kamu: ${account}\n\nPakai akun yang dipakai saat deploy.`
        );
      }

      const wei = ethers.parseEther(eth || "0");
      if (wei <= 0n) return alert("Jumlah withdraw harus > 0");
      if (!to || !to.startsWith("0x") || to.length < 42) return alert("Alamat tujuan (to) tidak valid");
      if (wei > balanceWei) return alert("Saldo kontrak tidak cukup");

      setLoading(true);

      const { contract } = await getContractWrite();
      const tx = await contract.withdraw(to, wei);
      await tx.wait();

      alert("Withdraw berhasil ✅");
      await loadAdminInfo();
    } catch (e) {
      console.error(e);
      alert(e?.shortMessage || e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 40 }}>
      <h2 style={{ marginBottom: 8 }}>Admin • Tarik Dana</h2>
      <div style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>
        Halaman ini hanya bisa dipakai oleh <b>owner</b> (akun yang deploy kontrak).
      </div>

      <div className="box" style={{ maxWidth: 520 }}>
        <div style={{ fontSize: 12, color: "#666" }}>Akun terhubung</div>
        <div style={{ marginTop: 6, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontFamily: "monospace" }}>{account || "-"}</div>
          <button className="btn" onClick={connectWallet}>
            {account ? "Ganti / Connect" : "Connect Wallet"}
          </button>
        </div>

        <div style={{ fontSize: 12, color: "#666", marginTop: 14 }}>Owner kontrak</div>
        <div style={{ marginTop: 6, fontFamily: "monospace" }}>{owner || "-"}</div>

        <div style={{ fontSize: 12, color: "#666", marginTop: 14 }}>Saldo kontrak</div>
        <div style={{ marginTop: 6 }}>
          <b>{ethers.formatEther(balanceWei)} ETH</b>
        </div>

        <hr style={{ margin: "18px 0", border: 0, borderTop: "1px solid #eee" }} />

        <div style={{ fontSize: 12, color: "#666" }}>Alamat tujuan (to)</div>
        <input
          style={{ width: "100%", border: "1px solid #e7e7e7", borderRadius: 10, padding: "10px 12px", marginTop: 6 }}
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="0x..."
        />

        <div style={{ fontSize: 12, color: "#666", marginTop: 14 }}>Jumlah (ETH)</div>
        <input
          style={{ width: "100%", border: "1px solid #e7e7e7", borderRadius: 10, padding: "10px 12px", marginTop: 6 }}
          value={eth}
          onChange={(e) => setEth(e.target.value)}
          placeholder="0.01"
        />

        <button className="btn btnDonate" onClick={withdraw} disabled={loading} style={{ marginTop: 14 }}>
          {loading ? "Memproses..." : isOwner ? "Tarik Dana" : "Bukan Owner"}
        </button>

        {!isOwner && owner && account && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#b00" }}>
            Kamu sedang memakai akun yang <b>bukan owner</b>. Switch akun di MetaMask ke akun deployer.
          </div>
        )}
      </div>
    </div>
  );
}
