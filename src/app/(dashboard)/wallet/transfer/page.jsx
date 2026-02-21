"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Loader2, ShieldCheck, AlertCircle, QrCode, X } from "lucide-react";
import Link from "next/link";

export default function TransferPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false); 
  
  const [balance, setBalance] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [spentToday, setSpentToday] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: wallet } = await supabase.from("wallets").select("balance").eq("user_id", user.id).single();
      if (wallet) setBalance(wallet.balance);

      // UPDATED: Logic to handle Custom vs Fixed Plan Limits
      const tier = user.user_metadata.subscription_tier || "regular";
      const isCustom = user.user_metadata.is_custom_plan;
      
      let activeLimit = 0;
      if (isCustom) {
        activeLimit = user.user_metadata.custom_daily_limit || 0;
      } else {
        const limits = { regular: 3500, worker: 8000, family: 25000 };
        activeLimit = limits[tier];
      }
      setDailyLimit(activeLimit);

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", user.id)
        .eq("category", "debit")
        .gte("created_at", startOfDay.toISOString());

      const totalSpent = transactions?.reduce((acc, tx) => acc + tx.amount, 0) || 0;
      setSpentToday(totalSpent);
    };

    fetchData();
  }, [supabase]);

  const remainingToday = dailyLimit - spentToday;
  const isOverLimit = Number(amount) > remainingToday;
  const isOverBalance = Number(amount) > balance;

  const handleTransfer = async (e) => {
    if (e) e.preventDefault();
    if (isOverLimit || isOverBalance || !amount || loading) return;

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
        description: "Debited", 
        status: "success",
        reference: `TRF-${Math.random().toString(36).toUpperCase().slice(2, 9)}`
      });

      router.push("/dashboard?status=sent");
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col p-6 md:p-12">
      
      {/* SCANNER OVERLAY */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6">
          <button onClick={() => setIsScanning(false)} className="absolute top-10 right-10 text-white"><X size={32}/></button>
          <div className="w-full max-w-sm aspect-square border-2 border-dashed border-[#FF6B00] rounded-3xl relative overflow-hidden bg-white/5">
             <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-black uppercase text-[10px] tracking-widest">Scanning for Vendor QR...</div>
          </div>
          <p className="mt-8 text-white font-black italic uppercase text-center tracking-tighter">Point at the Vendor's QR code</p>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto mb-12">
        <Link href="/wallet" className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-[#FF6B00] hover:text-white transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Balance</p>
          <p className="text-xl font-black text-slate-900 dark:text-white">₦{balance.toLocaleString()}</p>
        </div>
      </div>

      {/* MAIN FORM */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-xl mx-auto">
        <div className="w-full">
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-2 leading-none">Checkout</h1>
          
          {/* Daily Allowance Tracker */}
          <div className="flex items-center gap-4 mb-8 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-[9px] font-black uppercase text-slate-400">Today's Allowance</span>
                <span className="text-[9px] font-black uppercase text-slate-900 dark:text-white">
                  ₦{spentToday.toLocaleString()} / ₦{dailyLimit.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${spentToday >= dailyLimit ? 'bg-red-500' : 'bg-[#10B981]'}`}
                  style={{ width: `${Math.min((spentToday / dailyLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleTransfer} className="space-y-6 w-full">
            <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 border border-transparent focus-within:border-[#FF6B00]/40 transition-all flex items-center justify-between">
              <div className="flex-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Vendor ID</label>
                <input 
                  type="text" required value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Scan or type ID"
                  className="bg-transparent border-none outline-none w-full font-bold text-xl text-slate-900 dark:text-white"
                />
              </div>
              <button 
                type="button"
                onClick={() => setIsScanning(true)}
                className="w-14 h-14 bg-[#FF6B00] text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
              >
                <QrCode size={24} />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-10 border border-transparent focus-within:border-[#FF6B00]/40 transition-all">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Amount (₦)</label>
              <input 
                type="number" required value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent border-none outline-none w-full font-black text-7xl italic tracking-tighter text-slate-900 dark:text-white placeholder:text-slate-100 dark:placeholder:text-white/5"
              />
            </div>

            {(isOverLimit || isOverBalance) && (
              <div className="flex items-center gap-3 text-red-500 bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                <AlertCircle size={18} />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {isOverBalance ? "Insufficient Balance" : `Daily Limit Reached. Max left: ₦${remainingToday.toLocaleString()}`}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="w-full max-w-xl mx-auto pt-8">
        <button 
          onClick={handleTransfer}
          disabled={loading || !amount || isOverLimit || isOverBalance}
          className="w-full h-24 bg-slate-900 dark:bg-[#FF6B00] text-white dark:text-black rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-4 disabled:opacity-20 shadow-2xl transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <>Complete Payment <Send size={20} /></>}
        </button>
      </div>
    </div>
  );
}