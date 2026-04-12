"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap, Plus, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function TopUpForm() {
  const supabase = createClient();
  const router = useRouter();
  const [amount, setAmount] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user: activeUser } } = await supabase.auth.getUser();
      if (activeUser) {
        setUser(activeUser);
      }
    };
    init();
  }, [supabase]);

  const completeInjection = async (reference) => {
    setLoading(true);
    try {
      // 1. SAFELY fetch the current balance
      const { data: wallet, error: fetchError } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const newBalance = (Number(wallet?.balance) || 0) + Number(amount);

      // 2. Logic: Update if exists, Insert if new. STRICTLY balance only.
      if (wallet) {
        const { error: updateError } = await supabase
          .from("wallets")
          .update({ balance: newBalance })
          .eq("user_id", user.id);
          
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("wallets")
          .insert({ 
            user_id: user.id,
            balance: newBalance
          });
          
        if (insertError) throw insertError;
      }

      // 3. Log the transaction
      const { error: txError } = await supabase.from("transactions").insert({
        user_id: user.id,
        amount: Number(amount),
        reference: reference,
        category: "topup",
        description: "Funded Vault",
        status: "success"
      });

      if (txError) throw txError;

      // 4. Finalize and Redirect to Receipt!
      router.refresh();
      router.push(`/receipt/${reference}`); // <-- THIS IS THE MAGIC FIX

    } catch (err) {
      console.error("Vault Sync Error:", err);
      alert(`Payment successful but vault sync failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualPayment = () => {
    if (!window.PaystackPop || !user) return alert("System Link Error. Please refresh the page.");
    
    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: amount * 100,
      ref: `CS-FUND-${Date.now()}`,
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
            <ArrowLeft size={16}/> ABORT
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
        <div className="w-full max-w-md text-center">
          <div className="flex items-center justify-between mb-8 dark:text-white">
            <button onClick={() => setAmount(Math.max(100, amount - 1000))} className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-all"><Plus size={20} className="rotate-45"/></button>
            <div className="relative">
               <h2 className="text-7xl font-black italic tracking-tighter">₦{amount.toLocaleString()}</h2>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2 italic">Select Top Up Amount</p>
            </div>
            <button onClick={() => setAmount(amount + 1000)} className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-all"><Plus size={20}/></button>
          </div>

          <button 
            onClick={handleManualPayment}
            disabled={loading}
            className="w-full h-24 bg-slate-900 dark:bg-[#FF6B00] text-white dark:text-black font-black uppercase tracking-[0.6em] text-sm flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Fund Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
}