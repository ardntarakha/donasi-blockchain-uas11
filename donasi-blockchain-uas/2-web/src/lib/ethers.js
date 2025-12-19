import { ethers } from "ethers";
import abi from "../abi/DonationCampaign.json";

export function getProvider() {
  if (!window.ethereum) throw new Error("MetaMask tidak terdeteksi");
  return new ethers.BrowserProvider(window.ethereum);
}

export const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7"; // 11155111

export async function ensureSepolia() {
  if (!window.ethereum) throw new Error("MetaMask tidak terdeteksi");
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId === SEPOLIA_CHAIN_ID_HEX) return;

  // coba switch ke Sepolia
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }]
    });
  } catch (err) {
    // kalau Sepolia belum ada di MetaMask
    if (err?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: SEPOLIA_CHAIN_ID_HEX,
          chainName: "Sepolia",
          nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
          rpcUrls: ["https://rpc.sepolia.org"],
          blockExplorerUrls: ["https://sepolia.etherscan.io"]
        }]
      });
      return;
    }
    throw err;
  }
}

export function getContractRead() {
  const address = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!address) throw new Error("VITE_CONTRACT_ADDRESS belum diisi di .env");

  const provider = getProvider();
  const contract = new ethers.Contract(address, abi, provider);
  return { provider, contract, address };
}

export async function getContractWrite() {
  const address = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!address) throw new Error("VITE_CONTRACT_ADDRESS belum diisi di .env");

  await ensureSepolia();

  const provider = getProvider();
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);
  return { provider, signer, contract, address };
}
// alias biar kompatibel dengan kode lama
export async function getSignerContract() {
  return await getContractWrite();
}

export function getReadContract() {
  return getContractRead();
}
