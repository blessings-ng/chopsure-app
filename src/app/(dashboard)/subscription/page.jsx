"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, Users, Check, Loader2, ArrowLeft, Lock, CreditCard, ChefHat, Truck, AlertCircle } from "lucide-react";
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
  const [selectedMode, setSelectedMode] = useState(null); 
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
      
      await supabase.from("wallets").update({ 
        balance: currentBalance + amount,
        plan_locked_until: nextMonth.toISOString(),
        consumption_mode: selectedMode,
        last_mode_change: new Date().toISOString()
      }).eq("user_id", userData.id);

      await supabase.from("transactions").insert({
        user_id: userData.id,
        amount: amount,
        category: "topup",
        description: "Credited",
        status: "success",
        reference: reference
      });

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
    <div className="flex flex-col min-h-[calc(100vh-80px)] overflow-x-hidden">
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-white/5 py-8 px-6 lg:px-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase text-slate-900 dark:text-white">Unit <span className="text-[#FF6B00]">Selection</span></h1>
          <p className="text-[10px] font-black uppercase text-slate-500">Select your preferred unit</p>
        </div>
        <Link href="/dashboard" className="text-slate-400 hover:text-[#FF6B00] transition-colors"><ArrowLeft size={20}/></Link>
      </div>

      {/* MOBILE RESPONSIVE MODE SELECTION */}
      {!isLocked && (
        <div className={`py-10 px-6 flex flex-col items-center justify-center border-b border-slate-200 dark:border-white/5 transition-colors duration-500 ${!selectedMode ? 'bg-[#FF6B00]/5 dark:bg-[#FF6B00]/10' : 'bg-slate-50/50 dark:bg-white/[0.02]'}`}>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 text-center">
            {!selectedMode && (
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full animate-pulse">
                <AlertCircle size={14} /> Required Action
              </span>
            )}
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">
              Choose Consumption Mode
            </p>
          </div>

          {/* Stacks on mobile (flex-col), side-by-side on desktop (sm:flex-row) */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-md">
            <button 
              onClick={() => setSelectedMode('cooked')}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 md:px-10 md:py-5 rounded-2xl border-2 transition-all font-black uppercase text-xs tracking-widest ${selectedMode === 'cooked' ? 'border-[#FF6B00] bg-[#FF6B00] text-white shadow-lg shadow-orange-500/20 md:scale-105' : !selectedMode ? 'border-[#FF6B00]/40 text-slate-600 dark:text-slate-300 hover:border-[#FF6B00]' : 'border-slate-200 dark:border-white/5 text-slate-400 hover:border-slate-300'}`}
            >
              <ChefHat size={20}/> Cooked
            </button>
            <button 
              onClick={() => setSelectedMode('raw')}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 md:px-10 md:py-5 rounded-2xl border-2 transition-all font-black uppercase text-xs tracking-widest ${selectedMode === 'raw' ? 'border-[#10B981] bg-[#10B981] text-white shadow-lg shadow-green-500/20 md:scale-105' : !selectedMode ? 'border-[#10B981]/40 text-slate-600 dark:text-slate-300 hover:border-[#10B981]' : 'border-slate-200 dark:border-white/5 text-slate-400 hover:border-slate-300'}`}
            >
              <Truck size={20}/> Raw
            </button>
          </div>
        </div>
      )}

      {/* PLAN GRID */}
      <div className={`flex-1 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-white/5 transition-all duration-700 ${!selectedMode && !isLocked ? "opacity-30 grayscale pointer-events-none blur-[1px]" : ""}`}>
        {UNITS.map((unit) => (
          <div 
            key={unit.id}
            onClick={() => !isLocked && selectedMode && setSelected(unit.id)}
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

      {/* FOOTER */}
      <div className="p-8 bg-slate-50 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 flex flex-col items-center">
        {isLocked ? (
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Lock size={14}/> Selection Locked until the next open window
          </p>
        ) : (
          <button 
            onClick={handlePaymentTrigger}
            disabled={loading || !selectedMode}
            className="w-full max-w-xl h-20 bg-[#FF6B00] text-white dark:text-black font-black uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-4 hover:scale-[1.01] transition-all shadow-xl disabled:opacity-30 disabled:grayscale"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <CreditCard size={20}/> 
                {!selectedMode ? "Select Mode Above" : "Activate Plan"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}