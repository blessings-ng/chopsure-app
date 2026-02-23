// src/components/wallet/DigitalCard.jsx
import { Wallet } from "lucide-react";

export default function DigitalCard({ balance, loading }) {
  return (
    <div className="bg-slate-900 dark:bg-[#FF6B00] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden h-56 md:h-72 flex flex-col justify-center transition-all duration-500">
      
      {/* Background Decor: Scaled down for mobile */}
      <Wallet className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 size-48 md:size-64 opacity-10 rotate-12 pointer-events-none" />

      <div className="relative z-10">
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-60 mb-2 md:mb-3">
          Total Balance
        </p>
        
        {/* FLUID TEXT: text-4xl on mobile, scales to 7xl on desktop */}
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black italic tracking-tighter leading-none break-words">
          {loading ? (
            <span className="animate-pulse">...</span>
          ) : (
            `₦${Number(balance).toLocaleString()}`
          )}
        </h2>
      </div>

      {/* Industrial Tag: Extra detail for that "Premium" feel */}
      <div className="absolute top-8 right-8 hidden md:block">
        <div className="border border-white/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest opacity-40">
          ChopSure Secure Vault
        </div>
      </div>
    </div>
  );
}