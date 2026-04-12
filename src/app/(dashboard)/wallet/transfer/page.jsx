"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Loader2, AlertCircle, QrCode, X, CheckCircle2, Lock, Zap } from "lucide-react";
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
  const [accessStatus, setAccessStatus] = useState("loading");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUser(user);

      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance, consumption_mode")
        .eq("user_id", user.id)
        .maybeSingle();

      if (wallet?.consumption_mode === "raw") {
        setAccessStatus("denied_raw");
        return;
      } else {
        setAccessStatus("granted");
      }

      const currentBal = wallet?.balance || 0;
      setBalance(currentBal);

      const tier = user.user_metadata?.subscription_tier || "regular";
      const TIER_LIMITS = { regular: 3500, worker: 8000, family: 25000 };
      const activeLimit = TIER_LIMITS[tier] || 3500;
      setDailyLimit(activeLimit);

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

  useEffect(() => {
    let html5QrCode;
    if (isScanning && mounted) {
      const { Html5Qrcode } = require("html5-qrcode");
      html5QrCode = new Html5Qrcode("reader");
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      html5QrCode.start({ facingMode: "environment" }, config, (text) => {
          setRecipient(text);
          setIsScanning(false);
          html5QrCode.stop();
      }).catch(err => { if (!err.includes("is already scanning")) console.error(err); });
    }
    return () => { if (html5QrCode?.isScanning) html5QrCode.stop(); };
  }, [isScanning, mounted]);

  useEffect(() => {
    if (recipient.length > 3) setVendorName("Verified Vendor"); 
    else setVendorName("");
  }, [recipient]);

  const remainingAllowance = Math.max(0, dailyLimit - spentToday);
  const displayRemaining = Math.min(balance, remainingAllowance);

  const isOverLimit = Number(amount) > remainingAllowance;
  const isOverBalance = Number(amount) > balance;
  const canSubmit = !loading && Number(amount) > 0 && recipient && !isOverLimit && !isOverBalance;

  const handleTransfer = async (e) => {
    if (e) e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      const txAmount = Number(amount);
      const referenceCode = `CHOP-${Math.random().toString(36).toUpperCase().slice(2, 10)}`;

      const { error: walletError } = await supabase
        .from("wallets")
        .update({ balance: balance - txAmount })
        .eq("user_id", user.id);
      
      if (walletError) throw walletError;

      await supabase.from("transactions").insert({
        user_id: user.id,
        amount: txAmount,
        category: "debit",
        description: `Vendor: ${recipient}`, 
        status: "success",
        reference: referenceCode
      });

      setBalance(prev => prev - txAmount);
      setSpentToday(prev => prev + txAmount);

      setTimeout(() => {
        router.push(`/receipt/${referenceCode}`);
      }, 600);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  if (!mounted || accessStatus === "loading") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
            <Loader2 className="animate-spin text-[#FF6B00]" size={40} />
        </div>
      );
  }

  if (accessStatus === "denied_raw") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#050505] p-8 text-center">
        <Lock className="text-red-500 mb-6" size={48} />
        <h1 className="text-3xl font-black uppercase italic tracking-tighter dark:text-white mb-2">Checkout Not Allowed</h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest max-w-xs mb-8">Please use the Mart in Raw mode.</p>
        <Link href="/dashboard" className="w-full max-w-xs py-5 bg-[#FF6B00] text-black font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl">Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500 overflow-hidden font-sans">
      
      <AnimatePresence>
        {isScanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8">
            <button onClick={() => setIsScanning(false)} className="absolute top-10 right-6 p-4 bg-white/10 rounded-full text-white z-[110]"><X size={24}/></button>
            <div id="reader" className="w-full max-w-sm aspect-square border-2 border-[#FF6B00] rounded-[3rem] relative overflow-hidden bg-white/5">
                <div className="absolute inset-x-0 top-0 h-1 bg-[#FF6B00] shadow-[0_0_15px_#FF6B00] animate-scan z-20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto px-6 py-6 flex flex-col min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-[#FF6B00] hover:text-white transition-all"><ArrowLeft size={18} /></Link>
          <div className="text-right">
             <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Wallet Balance</p>
             <p className="text-sm font-black italic text-[#FF6B00]">₦{balance.toLocaleString()}</p>
          </div>
        </div>

        {/* BOLD TRACKER HEADER */}
        <div className="mb-8 bg-slate-900 dark:bg-white text-white dark:text-black p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Zap size={100} fill="currentColor" /></div>
            <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Daily Allocation</p>
                <div className="flex items-baseline gap-1 mb-6">
                    <h2 className="text-5xl font-black italic tracking-tighter">₦{Math.floor(displayRemaining).toLocaleString()}</h2>
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Left</span>
                </div>
                <div className="space-y-3">
                    <div className="h-2.5 w-full bg-black/20 dark:bg-black/10 rounded-full overflow-hidden">
                        <motion.div initial={false} animate={{ width: `${Math.min((spentToday / dailyLimit) * 100, 100)}%` }} className="h-full bg-[#FF6B00]" />
                    </div>
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-50 italic">
                        <span>Used: ₦{spentToday.toLocaleString()}</span>
                        <span>Max: ₦{Math.floor(dailyLimit).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-4 flex-1">
            <div className="relative bg-slate-50 dark:bg-white/5 border-2 border-transparent focus-within:border-[#FF6B00] rounded-[2rem] p-6 transition-all group shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recipient Identity</label>
                    {vendorName && <span className="text-[9px] font-black text-[#10B981] flex items-center gap-1"><CheckCircle2 size={10}/> {vendorName}</span>}
                </div>
                <div className="flex items-center gap-4">
                    <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="VND-XXXXXX" className="bg-transparent border-none outline-none flex-1 font-bold text-lg uppercase placeholder:text-slate-200 dark:placeholder:text-white/10"/>
                    <button onClick={() => setIsScanning(true)} className="p-3 bg-[#FF6B00] text-white rounded-xl shadow-lg shadow-orange-500/20 active:scale-90 transition-all"><QrCode size={20} /></button>
                </div>
            </div>

            <div className="relative bg-slate-50 dark:bg-white/5 border-2 border-transparent focus-within:border-[#FF6B00] rounded-[2.5rem] p-8 transition-all shadow-sm">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">Amount to Pay</label>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black italic text-[#FF6B00] opacity-30">₦</span>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="bg-transparent border-none outline-none w-full font-black text-6xl italic tracking-tighter text-slate-900 dark:text-white"/>
                </div>
            </div>

            <AnimatePresence>
                {(isOverLimit || isOverBalance) && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-red-500 bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                        <AlertCircle size={16} />
                        <p className="text-[9px] font-black uppercase tracking-widest">{isOverBalance ? "Insufficient Vault Funds" : "Daily Limit Exceeded"}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="mt-8 pb-4 group">
            <button onClick={handleTransfer} disabled={!canSubmit} className={`relative w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 overflow-hidden transition-all duration-300 border-2 ${canSubmit ? 'border-[#FF6B00] text-[#FF6B00] dark:text-white hover:text-white' : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-400 opacity-50'}`}>
                {canSubmit && <div className="absolute inset-0 w-full h-full bg-[#FF6B00] translate-y-[102%] group-hover:translate-y-0 transition-transform duration-500 -z-10" />}
                <span className="relative z-10 flex items-center gap-3">{loading ? <Loader2 className="animate-spin" /> : <>Complete Purchase <Send size={16} /></>}</span>
            </button>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes scan { 0% { transform: translateY(0); } 100% { transform: translateY(350px); } }
        .animate-scan { animation: scan 2s linear infinite; }
      `}</style>
    </div>
  );
}