import { useState } from "react";
import { ethers } from "ethers";
import { getSignerContract } from "../lib/ethers";

export default function DonateForm({ onDonated }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [eth, setEth] = useState("0.01");
  const [loading, setLoading] = useState(false);

  async function donate() {
    try {
      setLoading(true);
      const { contract } = await getSignerContract();

      const tx = await contract.donate(name || "Anon", message || "-", {
        value: ethers.parseEther(eth)
      });

      await tx.wait();
      onDonated?.(tx.hash);
      setName(""); setMessage("");
    } catch (e) {
      alert(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{border:"1px solid #ddd", padding:16, borderRadius:12}}>
      <h3>Donasi</h3>

      <label>Nama</label>
      <input value={name} onChange={e=>setName(e.target.value)} style={{width:"100%"}} />

      <label>Pesan</label>
      <input value={message} onChange={e=>setMessage(e.target.value)} style={{width:"100%"}} />

      <label>Jumlah (ETH)</label>
      <input value={eth} onChange={e=>setEth(e.target.value)} style={{width:"100%"}} />

      <button onClick={donate} disabled={loading} style={{marginTop:12}}>
        {loading ? "Memproses..." : "Donate"}
      </button>
    </div>
  );
}
