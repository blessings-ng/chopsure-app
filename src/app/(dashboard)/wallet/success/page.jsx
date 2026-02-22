"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Download, Share2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  
  const isFunding = status === "funded";
  const title = isFunding ? "P SECURED" : "PAYMENT COMPLETE";
  const subtitle = isFunding 
    ? "Your vault has been successfully injected with new capital." 
    : "Transaction authorized. The vendor has been credited.";

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6 text-center">
      
      {/* 1. SUCCESS ANIMATION */}
      <motion.div 
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12 }}
        className="w-32 h-32 bg-[#10B981] rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
      >
        <ShieldCheck size={60} className="text-white" strokeWidth={2.5} />
      </motion.div>

      {/* 2. TEXT CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-xs mx-auto">
          {subtitle}
        </p>
      </motion.div>

      {/* 3. QUICK ACTIONS (Industrial Style) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12"
      >
        <button className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all group">
          <Download size={20} className="text-slate-400 group-hover:text-[#FF6B00]" />
          <span className="text-[8px] font-black uppercase tracking-widest dark:text-white">Receipt</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all group">
          <Share2 size={20} className="text-slate-400 group-hover:text-[#FF6B00]" />
          <span className="text-[8px] font-black uppercase tracking-widest dark:text-white">Share</span>
        </button>
      </motion.div>

      {/* 4. PRIMARY RETURN BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm"
      >
        <Link 
          href="/dashboard"
          className="w-full h-20 bg-slate-900 dark:bg-[#FF6B00] text-white dark:text-black font-black uppercase tracking-[0.4em] text-sm rounded-[2rem] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
        >
          Return<ArrowRight size={20} strokeWidth={3} />
        </Link>
      </motion.div>

      {/* FOOTER BADGE */}
      <div className="mt-12 flex items-center gap-2 opacity-30">
        <CheckCircle2 size={12} className="text-[#10B981]" />
        <span className="text-[8px] font-black uppercase tracking-widest dark:text-white">Payment Successful</span>
      </div>
    </div>
  );
}