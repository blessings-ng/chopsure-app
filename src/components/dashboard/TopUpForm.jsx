"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Zap, Plus, Loader2, ShieldCheck, Edit3, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function TopUpForm() {
  const supabase = createClient();
  const [amount, setAmount] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // NEW: Lock state

  useEffect(() => {
    const init = async () => {
      const { data: { user: activeUser } } = await supabase.auth.getUser();
      if (activeUser) {
        setUser(activeUser);
        // Check if a plan is already active/locked
        const { data: wallet } = await supabase
          .from("wallets")
          .select("plan_locked_until")
          .eq("user_id", activeUser.id)
          .single();

        if (wallet?.plan_locked_until && new Date() < new Date(wallet.plan_locked_until)) {
          setIsLocked(true);
        }
      }
    };
    init();
  }, []);

  const completeInjection = async (reference) => {
    setLoading(true);
    try {
      // 1. Calculate Lock and Custom Daily Limit
      const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
      const calculatedDailyLimit = Math.floor(Number(amount) / 30);

      // 2. Log Transaction
      await supabase.from("transactions").insert({
        user_id: user.id,
        amount: Number(amount),
        reference: reference,
        category: "topup",
        description: "Credited",
        status: "success"
      });

      // 3. Update Wallet & Lock
      const { data: wallet } = await supabase.from("wallets").select("balance").eq("user_id", user.id).maybeSingle();
      const newBalance = (Number(wallet?.balance) || 0) + Number(amount);

      await supabase.from("wallets").update({ 
        balance: newBalance,
        plan_locked_until: nextMonth.toISOString()
      }).eq("user_id", user.id);

      // 4. Set Metadata for the Spending Page to recognize the custom limit
      await supabase.auth.updateUser({ 
        data: { 
          subscription_tier: "custom", 
          custom_daily_limit: calculatedDailyLimit,
          is_custom_plan: true 
        } 
      });

      window.location.href = "/dashboard?status=funded";
    } catch (err) {
      setLoading(false);
      alert("Vault sync failed. Ref: " + reference);
    }
  };

  const handleManualPayment = () => {
    if (isLocked) return; // Guard clause
    if (!window.PaystackPop || !user) return alert("System Link Error.");

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: amount * 100,
      ref: `CS-CUST-${Date.now()}`,
      callback: (response) => completeInjection(response.reference),
      onClose: () => setLoading(false)
    });

    handler.openIframe();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
      {/* LEFT SIDE */}
      <div className="lg:w-1/3 p-12 border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/10 flex flex-col justify-between text-slate-900 dark:text-white">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 mb-12 uppercase font-black text-[10px] tracking-widest hover:text-[#FF6B00] transition-colors">
            <ArrowLeft size={16}/> ABORT MISSION
          </Link>
          <Zap size={40} className="text-[#FF6B00] mb-6" fill="currentColor" />
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Fund<br/>Wallet</h1>
        </div>
        <div className="flex items-center gap-2 text-[#10B981] font-black uppercase text-[10px] tracking-widest">
          <ShieldCheck size={14}/> Secure 
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-transparent px-6">
        {isLocked ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <Lock className="text-slate-400" size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white">Protocol Locked</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">
              You are currently on an active plan cycle. This feature is restricted until next open window.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md text-center">
            {/* Amount Selection UI (Kept exactly as you had it) */}
            <div className="flex items-center justify-between mb-8 dark:text-white">
              <button onClick={() => setAmount(Math.max(100, amount - 1000))} className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-all"><Plus size={20} className="rotate-45"/></button>
              <div className="relative" onClick={() => setIsEditing(true)}>
                 <h2 className="text-7xl font-black italic tracking-tighter">₦{amount.toLocaleString()}</h2>
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Daily: ₦{Math.floor(amount/30).toLocaleString()}</p>
              </div>
              <button onClick={() => setAmount(amount + 1000)} className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-all"><Plus size={20}/></button>
            </div>

            <button 
              onClick={handleManualPayment}
              disabled={loading}
              className="w-full h-24 bg-slate-900 dark:bg-[#FF6B00] text-white dark:text-black font-black uppercase tracking-[0.6em] text-sm flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Authorize Injection"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}