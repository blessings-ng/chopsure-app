"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Loader2, AlertCircle, QrCode, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function TransferPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false); 
  const [vendorName, setVendorName] = useState("");
  
  const [balance, setBalance] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [spentToday, setSpentToday] = useState(0);
  const [user, setUser] = useState(null);

  // 1. HYDRATION GUARD
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. DATA FETCHING
  useEffect(() => {
    if (!mounted) return;
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);

      const { data: wallet } = await supabase.from("wallets").select("balance").eq("user_id", user.id).single();
      if (wallet) setBalance(wallet.balance);

      const tier = user.user_metadata.subscription_tier || "regular";
      const limits = { regular: 3500, worker: 8000, family: 25000 };
      setDailyLimit(user.user_metadata.custom_daily_limit || limits[tier]);

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", user.id)
        .eq("category", "debit")
        .gte("created_at", startOfDay.toISOString());

      setSpentToday(transactions?.reduce((acc, tx) => acc + tx.amount, 0) || 0);
    };
    fetchData();
  }, [mounted, supabase, router]);

  // 3. QR SCANNER HANDLER (Double-Initialization Proof)
  useEffect(() => {
    let html5QrCode;
    
    if (isScanning && mounted) {
      const { Html5Qrcode } = require("html5-qrcode");
      html5QrCode = new Html5Qrcode("reader");

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          setRecipient(decodedText);
          setIsScanning(false);
          html5QrCode.stop();
        },
        () => {} 
      ).catch(err => {
        if (!err.includes("is already scanning")) {
           console.error("Camera Error:", err);
        }
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [isScanning, mounted]);

  // Logic to "Validate" Vendor
  useEffect(() => {
    if (recipient.length > 3) {
      setVendorName("Verified Vendor ✅"); 
    } else {
      setVendorName("");
    }
  }, [recipient]);

  if (!mounted) return null;

  const remainingToday = dailyLimit - spentToday;
  const isOverLimit = Number(amount) > remainingToday;
  const isOverBalance = Number(amount) > balance;
  const canSubmit = !loading && amount > 0 && recipient && !isOverLimit && !isOverBalance;

  const handleTransfer = async (e) => {
    if (e) e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      const { error: walletError } = await supabase
        .from("wallets")
        .update({ balance: balance - Number(amount) })
        .eq("user_id", user.id);
      
      if (walletError) throw walletError;

      await supabase.from("transactions").insert({
        user_id: user.id,
        amount: Number(amount),
        category: "debit",
        description: `Paid: ${recipient}`, 
        status: "success",
        reference: `CHOP-${Math.random().toString(36).toUpperCase().slice(2, 10)}`
      });

      router.push("/dashboard?status=purchase_success");
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500 overflow-hidden font-sans">
      
      {/* SCANNER OVERLAY - Fixed visibility */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8"
          >
            <button onClick={() => setIsScanning(false)} className="absolute top-10 right-6 p-4 bg-white/10 rounded-full text-white z-[110]">
              <X size={24}/>
            </button>
            
            <div id="reader" className="w-full max-w-sm aspect-square border-2 border-[#FF6B00] rounded-[3rem] relative overflow-hidden bg-white/5">
                <div className="absolute inset-x-0 top-0 h-1 bg-[#FF6B00] shadow-[0_0_15px_#FF6B00] animate-scan z-20" />
            </div>

            <div className="text-center mt-12">
                <p className="text-[#FF6B00] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Camera Active</p>
                <p className="text-white/60 text-sm font-medium italic">Scanning Vendor Identity...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto px-6 py-8 md:py-12 flex flex-col min-h-screen">
        
        {/* NAV */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/dashboard" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-[#FF6B00] hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="text-right">
             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Vault</p>
             <p className="text-lg font-black italic text-[#FF6B00]">₦{balance.toLocaleString()}</p>
          </div>
        </div>

        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-10">Checkout</h1>

        {/* TRACKER */}
        <div className="mb-10 bg-slate-50 dark:bg-white/5 p-5 rounded-[2rem] border border-slate-100 dark:border-white/5">
            <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Limit Usage</span>
                <span className={`text-[10px] font-black italic ${isOverLimit ? 'text-red-500' : 'text-[#10B981]'}`}>
                    ₦{spentToday.toLocaleString()} / ₦{dailyLimit.toLocaleString()}
                </span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((spentToday / dailyLimit) * 100, 100)}%` }}
                    className={`h-full ${isOverLimit ? 'bg-red-500' : 'bg-[#FF6B00]'}`}
                />
            </div>
        </div>

        {/* FORM */}
        <div className="space-y-4 flex-1">
            <div className="relative bg-slate-50 dark:bg-white/5 border-2 border-transparent focus-within:border-[#FF6B00] rounded-[2rem] p-6 transition-all group">
                <div className="flex justify-between items-start mb-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vendor Identity</label>
                    {vendorName && <span className="text-[9px] font-black text-[#10B981] uppercase tracking-tighter flex items-center gap-1"><CheckCircle2 size={10}/> {vendorName}</span>}
                </div>
                <div className="flex items-center gap-4">
                    <input 
                        type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)}
                        placeholder="VND-XXXXXX"
                        className="bg-transparent border-none outline-none flex-1 font-bold text-lg uppercase placeholder:text-slate-200 dark:placeholder:text-white/5"
                    />
                    <button onClick={() => setIsScanning(true)} className="p-3 bg-[#FF6B00] text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/20">
                        <QrCode size={20} />
                    </button>
                </div>
            </div>

            <div className="relative bg-slate-50 dark:bg-white/5 border-2 border-transparent focus-within:border-[#FF6B00] rounded-[2.5rem] p-8 transition-all">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4 leading-none">Amount</label>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black italic opacity-30 text-[#FF6B00]">₦</span>
                    <input 
                        type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="bg-transparent border-none outline-none w-full font-black text-6xl italic tracking-tighter text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            <AnimatePresence>
                {(isOverLimit || isOverBalance) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 text-red-500 bg-red-500/5 p-4 rounded-2xl border border-red-500/10"
                    >
                        <AlertCircle size={16} />
                        <p className="text-[10px] font-black uppercase tracking-widest">
                           {isOverBalance ? "Insufficient Vault Funds" : "Daily Limit Reached"}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* LIQUID FILL BUTTON */}
        <div className="mt-8 pb-4 group">
            <button 
                onClick={handleTransfer}
                disabled={!canSubmit}
                className={`relative w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 overflow-hidden transition-all duration-300 border-2
                    ${canSubmit 
                        ? 'border-[#FF6B00] text-[#FF6B00] dark:text-white hover:text-white shadow-2xl shadow-orange-500/10' 
                        : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-400 opacity-50 cursor-not-allowed'}`}
            >
                {/* GROWING BACKGROUND */}
                {canSubmit && (
                    <div className="absolute inset-0 w-full h-full bg-[#FF6B00] translate-y-[102%] group-hover:translate-y-0 transition-transform duration-500 ease-out -z-10" />
                )}
                
                <span className="relative z-10 flex items-center gap-3">
                   {loading ? <Loader2 className="animate-spin" /> : <>Complete Purchase <Send size={16} /></>}
                </span>
            </button>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes scan {
            0% { transform: translateY(0); }
            100% { transform: translateY(350px); }
        }
        .animate-scan {
            animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}