// src/components/wallet/DigitalCard.jsx
import { Wallet } from "lucide-react";

export default function DigitalCard({ balance, loading }) {
  return (
    <div className="bg-slate-900 dark:bg-[#FF6B00] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden h-72 flex flex-col justify-center">
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Balance</p>
        <h2 className="text-6xl md:text-7xl font-black italic tracking-tighter leading-none">
          {loading ? "..." : `₦${Number(balance).toLocaleString()}`}
        </h2>
      </div>
      <Wallet className="absolute -bottom-10 -right-10 size-64 opacity-10 rotate-12" />
    </div>
  );
}