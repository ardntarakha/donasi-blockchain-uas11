import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Admin from "./pages/Admin";

export default function App() {
  const [account, setAccount] = useState("");

  async function connectWallet() {
    if (!window.ethereum) return alert("MetaMask belum terpasang");
    const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accs?.[0] || "");
  }

  useEffect(() => {
    if (!window.ethereum) return;
    const handler = (accs) => setAccount(accs?.[0] || "");
    window.ethereum.on("accountsChanged", handler);
    return () => window.ethereum?.removeListener?.("accountsChanged", handler);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home account={account} onConnect={connectWallet} />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
