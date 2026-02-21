"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Briefcase, Users, Check, Loader2, ArrowLeft, Shield, Lock, CreditCard, ChefHat, Truck } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const UNITS = [
  {
    id: "regular",
    name: "Regular",
    daily: 3500,
    monthly: 105000,
    color: "text-slate-500",
    bg: "bg-slate-500/5",
    icon: <User size={24} />
  },
  {
    id: "worker",
    name: "Worker",
    daily: 8000,
    monthly: 240000,
    color: "text-[#FF6B00]",
    bg: "bg-[#FF6B00]/5",
    icon: <Briefcase size={24} />,
    popular: true
  },
  {
    id: "family",
    name: "Family",
    daily: 25000,
    monthly: 750000,
    color: "text-purple-500",
    bg: "bg-purple-500/5",
    icon: <Users size={24} />
  }
];

export default function SubscriptionPage() {
  const supabase = createClient();
  const router = useRouter();
  const [selected, setSelected] = useState("worker");
  const [selectedMode, setSelectedMode] = useState(null); // Added for Cooked/Raw logic
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData(user);
        const { data: wallet } = await supabase.from("wallets").select("balance, plan_locked_until, consumption_mode").eq("user_id", user.id).single();
        if (wallet) {
          setCurrentBalance(wallet.balance);
          setSelectedMode(wallet.consumption_mode || null);
          if (wallet.plan_locked_until && new Date() < new Date(wallet.plan_locked_until)) {
            setIsLocked(true);
          }
        }
      }
    }
    init();
  }, [supabase]);

  const finalizePayment = async (reference, amount) => {
    try {
      const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
      
      // 1. Credit Vault, Lock Plan, and Save Consumption Mode
      await supabase.from("wallets").update({ 
        balance: currentBalance + amount,
        plan_locked_until: nextMonth.toISOString(),
        consumption_mode: selectedMode,
        last_mode_change: new Date().toISOString()
      }).eq("user_id", userData.id);

      // 2. Log Transaction
      await supabase.from("transactions").insert({
        user_id: userData.id,
        amount: amount,
        category: "topup",
        description: "Credited",
        status: "success",
        reference: reference
      });

      // 3. Update Auth Metadata
      await supabase.auth.updateUser({ 
        data: { 
          subscription_tier: selected,
          is_custom_plan: false 
        } 
      });

      router.push("/dashboard?status=funded");
    } catch (err) {
      alert("Payment successful but vault sync failed. Ref: " + reference);
    }
  };

  const handlePaymentTrigger = () => {
    if (!selectedMode) return alert("Please select a mode: Cooked or Raw");
    if (!window.PaystackPop) return alert("Payment system offline. Refresh.");
    const plan = UNITS.find(u => u.id === selected);
    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: userData.email,
      amount: plan.monthly * 100, 
      callback: (response) => finalizePayment(response.reference, plan.monthly),
      onClose: () => setLoading(false)
    });
    handler.openIframe();
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* HEADER (Unchanged) */}
      <div className="border-b border-slate-200 dark:border-white/5 py-8 px-6 lg:px-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase text-slate-900 dark:text-white">Unit <span className="text-[#FF6B00]">Selection</span></h1>
          <p className="text-[10px] font-black uppercase text-slate-500">Fund your monthly vault capacity</p>
        </div>
        <Link href="/dashboard" className="text-slate-400 hover:text-[#FF6B00] transition-colors"><ArrowLeft size={20}/></Link>
      </div>

      {/* NEW: MODE SELECTION STRIP (Minimal addition) */}
      {!isLocked && (
        <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-black/40 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-4">Deployment Mode:</p>
          <div className="flex gap-4">
            <button 
              onClick={() => setSelectedMode('cooked')}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all font-black uppercase text-[10px] tracking-widest ${selectedMode === 'cooked' ? 'border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00]' : 'border-slate-200 dark:border-white/5 text-slate-400'}`}
            >
              <ChefHat size={16}/> Cooked
            </button>
            <button 
              onClick={() => setSelectedMode('raw')}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all font-black uppercase text-[10px] tracking-widest ${selectedMode === 'raw' ? 'border-[#10B981] bg-[#10B981]/5 text-[#10B981]' : 'border-slate-200 dark:border-white/5 text-slate-400'}`}
            >
              <Truck size={16}/> Raw
            </button>
          </div>
        </div>
      )}


      {/* PLAN GRID (Unchanged UI) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-white/5">
        {UNITS.map((unit) => (
          <div 
            key={unit.id}
            onClick={() => !isLocked && setSelected(unit.id)}
            className={`relative p-10 flex flex-col justify-between transition-all duration-500 ${isLocked ? "opacity-40 grayscale" : "cursor-pointer"} ${selected === unit.id ? unit.bg : ""}`}
          >
            {selected === unit.id && <motion.div layoutId="glow" className="absolute inset-0 border-2 border-[#FF6B00] z-10 pointer-events-none" />}
            
            <div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-current mb-8 ${unit.color}`}>
                {unit.icon}
              </div>
              <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white">{unit.name}</h3>
              
              <div className="mt-4">
                <span className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                  ₦{unit.monthly.toLocaleString()}
                </span>
                <p className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest mt-2">Monthly Total</p>
              </div>

              <p className="text-slate-400 font-bold text-xs mt-6 flex items-center gap-2">
                <Check size={14} className="text-[#10B981]" /> ₦{unit.daily.toLocaleString()} Daily Spending Limit
              </p>
            </div>

            <div className={`h-12 flex items-center justify-center font-black uppercase tracking-widest text-[10px] border-2 mt-12 ${selected === unit.id ? "bg-slate-900 dark:bg-white text-white dark:text-black border-transparent" : "text-slate-400 border-slate-200 dark:border-white/5"}`}>
              {isLocked ? "Plan Active" : selected === unit.id ? "Selected" : "Choose Unit"}
            </div>
          </div>
        ))}
      </div>

      
      {/* FOOTER (Unchanged Action) */}
      <div className="p-8 bg-slate-50 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 flex flex-col items-center">
        {isLocked ? (
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Lock size={14}/> Protocol Locked until the 1st
          </p>
        ) : (
          <button 
            onClick={handlePaymentTrigger}
            disabled={loading || !selectedMode}
            className="w-full max-w-xl h-20 bg-[#FF6B00] text-white dark:text-black font-black uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-4 hover:scale-[1.01] transition-all shadow-xl disabled:opacity-30"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><CreditCard size={20}/> Pay & Deploy Unit</>}
          </button>
        )}
      </div>
    </div>
  );
}