"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Check, ArrowLeft, Download, Share2, Printer, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ReceiptPage() {
  const { id } = useParams();
  const supabase = createClient();
  const router = useRouter();
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReceipt() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("reference", id)
        .maybeSingle();

      if (error || !data) {
        console.error("Receipt error:", error);
      } else {
        setTx(data);
      }
      setLoading(false);
    }
    fetchReceipt();
  }, [id, supabase]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
      <Loader2 className="animate-spin text-[#FF6B00]" size={40} />
    </div>
  );

  if (!tx) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#050505] p-6 text-center">
      <h1 className="text-2xl font-black uppercase italic dark:text-white">Receipt Not Found</h1>
      <Link href="/dashboard" className="mt-4 text-[#FF6B00] font-bold uppercase text-[10px] tracking-widest">Back to Dashboard</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] py-12 px-6 font-sans">
      <div className="max-w-md mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 mb-8 uppercase font-black text-[10px] tracking-widest hover:text-[#FF6B00] transition-colors">
          <ArrowLeft size={16}/> Dashboard
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5"
        >
          {/* SUCCESS HEADER */}
          <div className="bg-[#10B981] p-10 text-center relative overflow-hidden">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-xl"
            >
              <Check className="text-[#10B981]" size={40} strokeWidth={4} />
            </motion.div>
            <h2 className="text-white font-black uppercase italic tracking-tighter text-2xl relative z-10">Payment Successful</h2>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1 relative z-10">Transaction Confirmed</p>
          </div>

          {/* DETAILS */}
          <div className="p-10 space-y-8">
            <div className="text-center border-b border-dashed border-slate-200 dark:border-white/10 pb-8">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2">Amount Paid</p>
              <h1 className="text-6xl font-black italic tracking-tighter text-slate-900 dark:text-white">
                ₦{tx.amount.toLocaleString()}
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Detail label="Vendor / Description" value={tx.description} />
              <Detail label="Reference" value={tx.reference} />
              <Detail label="Date & Time" value={new Date(tx.created_at).toLocaleString()} />
              <Detail label="Status" value="SUCCESSFUL" isStatus />
            </div>

            <div className="pt-8 grid grid-cols-2 gap-4">
              <button onClick={() => window.print()} className="flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white hover:bg-[#FF6B00] hover:text-white transition-all">
                <Printer size={16}/> Print
              </button>
              <button className="flex items-center justify-center gap-2 py-4 bg-[#FF6B00] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 hover:scale-105 transition-all">
                <Share2 size={16}/> Share
              </button>
            </div>
          </div>
        </motion.div>

        <p className="text-center mt-12 text-[9px] font-black uppercase text-slate-400 tracking-[0.4em]">
          Secured by ChopSafe Protocol
        </p>
      </div>
    </div>
  );
}

function Detail({ label, value, isStatus }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
      <span className={`text-xs font-black uppercase italic ${isStatus ? 'text-[#10B981]' : 'text-slate-900 dark:text-white'}`}>
        {value}
      </span>
    </div>
  );
}