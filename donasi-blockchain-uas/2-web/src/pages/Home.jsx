import { useEffect, useMemo, useRef, useState } from "react";
import { ethers } from "ethers";
import heroImg from "../assets/hero.jpg";
import { getContractRead, getContractWrite } from "../lib/ethers";

export default function Home({ account, onConnect }) {
  const [info, setInfo] = useState({
    title: "",
    description: "",
    goalWei: 0n,
    totalWei: 0n,
    balanceWei: 0n
  });

  const [eth, setEth] = useState("0.001");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastTx, setLastTx] = useState("");
  const [status, setStatus] = useState("");

  const explorerTx = import.meta.env.VITE_EXPLORER_TX;
  const explorerAddr = import.meta.env.VITE_EXPLORER_ADDR;
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  const readContractRef = useRef(null);

  async function load() {
    try {
      setStatus("Memuat data...");
      const { contract } = getContractRead();

      const [title, description, goalWei, totalRaisedWei, balanceWei] =
        await Promise.all([
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

      setStatus("");
    } catch (e) {
      console.error(e);
      setStatus("Gagal memuat data");
    }
  }

  useEffect(() => {
    let contract;

    (async () => {
      try {
        const read = getContractRead();
        contract = read.contract;
        readContractRef.current = contract;

        await load();

        contract.on("Donated", () => {
          load();
        });
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      try {
        if (contract) contract.removeAllListeners("Donated");
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goalEth = useMemo(
    () => Number(ethers.formatEther(info.goalWei || 0n)),
    [info.goalWei]
  );

  const totalEth = useMemo(
    () => Number(ethers.formatEther(info.totalWei || 0n)),
    [info.totalWei]
  );

  const pct = goalEth > 0 ? Math.min(100, (totalEth / goalEth) * 100) : 0;

  const goalReached = useMemo(() => {
    return info.goalWei > 0n && info.totalWei >= info.goalWei;
  }, [info.goalWei, info.totalWei]);

  async function donateNow() {
    try {
      if (!window.ethereum) return alert("MetaMask belum terpasang");
      if (!account) {
        await onConnect();
        return;
      }

      const wei = ethers.parseEther(eth || "0");
      if (wei <= 0n) return alert("Jumlah donasi harus > 0");

      setLoading(true);
      setStatus("Mengirim transaksi...");

      const { contract } = await getContractWrite();

      const tx = await contract.donate(name || "Anon", message || "-", {
        value: wei
      });

      setLastTx(tx.hash);
      setStatus("Menunggu konfirmasi blockchain...");

      await tx.wait();
      await load();

      setName("");
      setMessage("");
      setStatus("Donasi berhasil ✅");
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      console.error(e);
      alert(e?.shortMessage || e?.message || String(e));
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setStatus("Alamat kontrak disalin ✅");
      setTimeout(() => setStatus(""), 1500);
    } catch {
      alert("Gagal menyalin alamat kontrak");
    }
  }

  return (
    <>
      <div className="hero" id="donasi">
        <div className="heroImg">
          <img src={heroImg} alt="Ruang Peduli" />
        </div>

        <div className="heroPanel">
          <h1 className="heroTitle">{info.title || "Ruang Peduli"}</h1>
          <p className="heroSub">
            {info.description ||
              "Platform donasi digital berbasis blockchain yang transparan dan aman."}
          </p>

          <div className="box">
            <div className="statsRow">
              <div>
                <div className="small">Dana Terkumpul</div>
                <b>{totalEth.toFixed(6)} ETH</b>
              </div>
              <div>
                <div className="small">Target Donasi</div>
                <b>{goalEth.toFixed(6)} ETH</b>
              </div>
              <div>
                <div className="small">Progres</div>
                <b>{pct.toFixed(1)}%</b>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="progress">
                <div style={{ width: `${pct}%` }} />
              </div>

              {goalReached && (
                <div className="pill" style={{ marginTop: 10 }}>
                  ✅ Target donasi tercapai
                </div>
              )}

              <div className="small" style={{ marginTop: 10 }}>
                Saldo Kontrak:{" "}
                <span className="mono">
                  {ethers.formatEther(info.balanceWei || 0n)} ETH
                </span>
              </div>

              {status && (
                <div className="small" style={{ marginTop: 8 }}>
                  Status: <b>{status}</b>
                </div>
              )}
            </div>

            <div className="row" style={{ marginTop: 14 }}>
              {!account ? (
                <button className="btn" onClick={onConnect}>
                  Hubungkan Wallet
                </button>
              ) : (
                <span className="badge" title={account}>
                  {account.slice(0, 6)}…{account.slice(-4)}
                </span>
              )}

              <button
                className="btn btnDonate"
                onClick={donateNow}
                disabled={loading}
              >
                {loading ? "Memproses..." : "Donasi Sekarang"}
              </button>

              <button className="btn" onClick={load} disabled={loading}>
                Refresh
              </button>
            </div>

            <div className="label">Jumlah Donasi (ETH)</div>
            <input
              className="input"
              value={eth}
              onChange={(e) => setEth(e.target.value)}
              placeholder="0.001"
            />

            <div className="quickRow">
              <button className="quickBtn" onClick={() => setEth("0.001")}>
                0.001
              </button>
              <button className="quickBtn" onClick={() => setEth("0.005")}>
                0.005
              </button>
              <button className="quickBtn" onClick={() => setEth("0.01")}>
                0.01
              </button>
            </div>

            <div className="label">Nama (opsional)</div>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Andi"
            />

            <div className="label">Pesan (opsional)</div>
            <input
              className="input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Semoga bermanfaat 🙏"
            />

            <div className="row" style={{ marginTop: 14 }}>
              <a
                className="btn"
                href={`${explorerAddr}${contractAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                Lihat Kontrak
              </a>

              <button className="btn" onClick={copyAddress}>
                Copy Address
              </button>

              {lastTx && (
                <a
                  className="btn"
                  href={`${explorerTx}${lastTx}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Lihat Transaksi
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="section">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <h2>Donasi Digital untuk Masa Depan</h2>
            <div className="smallDark">
              Transparan • Aman • Tercatat di Blockchain
            </div>
          </div>

          <div style={{ height: 16 }} />

          <div className="cards3">
            <div className="card">
              <div className="icon">👥</div>
              <b>Kepercayaan Donatur</b>
              <p>Semua transaksi dapat diverifikasi secara publik.</p>
            </div>
            <div className="card">
              <div className="icon">🔗</div>
              <b>Transparansi On-chain</b>
              <p>Donasi langsung tercatat di smart contract.</p>
            </div>
            <div className="card">
              <div className="icon">✅</div>
              <b>Proses Mudah</b>
              <p>Hubungkan wallet → donasi → selesai.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="container">
          <b>Ruang Peduli</b>
          <div className="small">
            Platform Donasi Digital Berbasis Blockchain
            <br />
            Proyek UAS • Sepolia Testnet
          </div>
        </div>
      </div>
    </>
  );
}
