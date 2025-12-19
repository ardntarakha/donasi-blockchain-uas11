import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import heroImg from "../assets/hero.jpg";
import { getReadContract, getSignerContract } from "../lib/ethers";

export default function Donate({ account, onConnect }) {
  const [info, setInfo] = useState({
    title: "",
    description: "",
    goalWei: 0n,
    totalWei: 0n,
    balanceWei: 0n
  });

  const [eth, setEth] = useState("0.01");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastTx, setLastTx] = useState("");

  const explorerTx = import.meta.env.VITE_EXPLORER_TX;
  const explorerAddr = import.meta.env.VITE_EXPLORER_ADDR;
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  async function load() {
    const { contract } = await getReadContract();
    const [title, description, goalWei, totalRaisedWei, balanceWei] = await Promise.all([
      contract.title(),
      contract.description(),
      contract.goalWei(),
      contract.totalRaisedWei(),
      contract.contractBalance()
    ]);

    setInfo({
      title,
      description,
      goalWei,
      totalWei: totalRaisedWei,
      balanceWei
    });
  }

  useEffect(() => {
    load();
  }, []);

  const goalEth = useMemo(() => Number(ethers.formatEther(info.goalWei || 0n)), [info.goalWei]);
  const totalEth = useMemo(() => Number(ethers.formatEther(info.totalWei || 0n)), [info.totalWei]);
  const pct = goalEth > 0 ? Math.min(100, (totalEth / goalEth) * 100) : 0;

  async function donateNow() {
    try {
      if (!window.ethereum) return alert("MetaMask belum terpasang");
      if (!account) return onConnect?.();

      setLoading(true);

      const { contract } = await getSignerContract();
      const tx = await contract.donate(name || "Anon", message || "-", {
        value: ethers.parseEther(eth || "0")
      });

      await tx.wait();

      setLastTx(tx.hash);
      setName("");
      setMessage("");

      // ✅ Update otomatis setelah donasi
      await load();
    } catch (e) {
      alert(e?.shortMessage || e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container section" style={{ paddingTop: 20 }}>
      {/* HERO IMAGE OVERLAY */}
      <div
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid #e7e7e7"
        }}
      >
        <img
          src={heroImg}
          alt="Donasi Ruang Peduli"
          style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
        />

        {/* Overlay content center */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            padding: 18,
            background: "linear-gradient(0deg, rgba(0,0,0,.55), rgba(0,0,0,.25))"
          }}
        >
          <div
            style={{
              width: "min(720px, 100%)",
              background: "rgba(255,255,255,.92)",
              borderRadius: 14,
              padding: 18,
              border: "1px solid rgba(255,255,255,.65)"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2 style={{ margin: "0 0 8px" }}>
                {info.title || "Ruang Peduli"} — Donasi Sekarang
              </h2>
              <p style={{ margin: 0, color: "#444", lineHeight: 1.7 }}>
                {info.description ||
                  "Donasi digital berbasis blockchain. Setiap transaksi tercatat dan dapat diverifikasi melalui explorer."}
              </p>
            </div>

            <div style={{ height: 14 }} />

            {/* Buttons center */}
            <div className="row" style={{ justifyContent: "center" }}>
              {!account ? (
                <button className="btn" onClick={onConnect}>
                  Hubungkan Wallet
                </button>
              ) : (
                <span className="badge" title={account}>
                  Wallet: {account.slice(0, 6)}…{account.slice(-4)}
                </span>
              )}

              <button className="btn btnDonate" onClick={donateNow} disabled={loading}>
                {loading ? "Memproses..." : "DONASI"}
              </button>
            </div>

            <div style={{ height: 16 }} />

            {/* Form */}
            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Jumlah Donasi (ETH)</div>
                <input
                  className="input"
                  style={{ border: "1px solid #e7e7e7" }}
                  value={eth}
                  onChange={(e) => setEth(e.target.value)}
                  placeholder="0.01"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Nama (opsional)</div>
                  <input
                    className="input"
                    style={{ border: "1px solid #e7e7e7" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Misal: Andi"
                  />
                </div>

                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Pesan (opsional)</div>
                  <input
                    className="input"
                    style={{ border: "1px solid #e7e7e7" }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Contoh: Semoga bermanfaat 🙏"
                  />
                </div>
              </div>

              <div className="row" style={{ justifyContent: "center" }}>
                <a className="btn" href={`${explorerAddr}${contractAddress}`} target="_blank" rel="noreferrer">
                  Lihat Kontrak
                </a>
                {lastTx && (
                  <a className="btn" href={`${explorerTx}${lastTx}`} target="_blank" rel="noreferrer">
                    Lihat Transaksi Terakhir
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS: Dana terkumpul & progres (update otomatis setelah donate) */}
      <div style={{ height: 16 }} />

      <div style={{ border: "1px solid #e7e7e7", borderRadius: 14, padding: 16, background: "#f6f7f6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "#666" }}>Dana Terkumpul</div>
            <b style={{ fontSize: 18 }}>{totalEth.toFixed(6)} ETH</b>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666" }}>Target Donasi</div>
            <b style={{ fontSize: 18 }}>{goalEth.toFixed(6)} ETH</b>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666" }}>Progres</div>
            <b style={{ fontSize: 18 }}>{pct.toFixed(1)}%</b>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666" }}>Saldo Smart Contract</div>
            <b style={{ fontSize: 18 }}>{ethers.formatEther(info.balanceWei || 0n)} ETH</b>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ height: 10, background: "#ddd", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: 10, background: "#2f6b2f" }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#666", lineHeight: 1.7 }}>
            *Setiap donasi akan membuat transaksi on-chain yang bisa diverifikasi publik melalui explorer.
          </div>
        </div>
      </div>
    </div>
  );
}
