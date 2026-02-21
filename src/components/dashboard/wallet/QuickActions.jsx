// src/components/wallet/QuickActions.jsx
import { Plus, Send } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
      <Link href="/top-up" className="h-16 bg-white dark:bg-white text-black rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">
        <Plus size={18} strokeWidth={3} /> Top Up
      </Link>
      <Link href="/wallet/transfer" className="h-16 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest hover:bg-[#FF6B00] hover:text-white transition-all">
        <Send size={18} /> Transfer
      </Link>
    </div>
  );
}