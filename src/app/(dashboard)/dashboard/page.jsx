"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ShieldCheck, Zap, Briefcase, Users, CheckCircle2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import VaultCard from "@/components/dashboard/VaultCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import Skeleton from "@/components/dashboard/Skeleton";

// Floating Success Notice Component
const SuccessNotice = ({ show, onClose }) => (
  <AnimatePresence>
    {show && (
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[92%] md:w-auto"
      >
        <div className="bg-green-500 text-white px-5 py-3 md:px-6 md:py-4 rounded-2xl shadow-2xl shadow-green-500/20 flex items-center gap-4 border border-white/20 backdrop-blur-xl">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="flex-1">
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Order Confirmed</p>
            <p className="text-xs md:text-sm font-bold italic uppercase">Purchase Successful!</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

function DashboardContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [allowanceData, setAllowanceData] = useState({ remaining: 0, total: 0 });

  useEffect(() => {
    const getData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);

      const { data: wallet } = await supabase
        .from("wallets")
        .select("daily_allowance, total_limit")
        .eq("user_id", user.id)
        .single();

      if (wallet) {
        setAllowanceData({
          remaining: wallet.daily_allowance || 0,
          total: wallet.total_limit || 1 
        });
      }
      setLoading(false);
    };
    
    getData();

    if (searchParams.get("status") === "purchase_success") {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [router, supabase, searchParams]);

  const tier = user?.user_metadata?.subscription_tier || "regular";
  
  const unitConfig = {
    regular: { name: "Regular Unit", icon: <Zap size={14} />, theme: "text-slate-400 border-slate-400" },
    worker: { name: "Worker Unit", icon: <Briefcase size={14} className="text-[#FF6B00]" />, theme: "text-[#FF6B00] border-[#FF6B00]" },
    family: { name: "Family Unit", icon: <Users size={14} className="text-purple-500" />, theme: "text-purple-500 border-purple-500" }
  };

  const currentUnit = unitConfig[tier] || unitConfig.regular;
  const allowancePercentage = (allowanceData.remaining / allowanceData.total) * 100;

  if (loading) {
    return (
      <div className="space-y-8 p-4 md:p-0 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div className="space-y-3"><Skeleton className="h-8 w-40" /><Skeleton className="h-4 w-60" /></div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-56 rounded-[2.5rem]" />
          <Skeleton className="h-56 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="relative space-y-6 md:space-y-10 pb-16 px-4 md:px-0"
    >
      <SuccessNotice show={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* HEADER SECTION: Stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 md:pt-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest bg-white/5 ${currentUnit?.theme}`}>
              {currentUnit?.icon} {currentUnit?.name}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
            welcome back!
          </h1>
        </div>

        {/* Action Buttons: Full width on mobile */}
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/top-up" className="flex-1 md:flex-none text-center px-6 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl active:scale-95 transition-all">
            Top Up
          </Link>
          <Link href="/subscription" className="flex-1 md:flex-none text-center px-6 py-4 bg-[#FF6B00] text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-[0_15px_30px_rgba(255,107,0,0.3)] active:scale-95 transition-all">
            Subscription
          </Link>
        </div>
      </div>

      {/* BALANCE CARDS: Vertical on mobile, Grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <VaultCard user={user} />

        <div className="bg-[#FF6B00] rounded-[2.5rem] p-8 md:p-10 text-black relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 p-6 md:p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <ShieldCheck size={100} className="md:w-[120px] md:h-[120px]" strokeWidth={1} />
          </div>
          
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px] md:min-h-[160px]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Remaining Allowance</p>
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-none">
                ₦{allowanceData.remaining.toLocaleString()}
              </h2>
              <div className="flex items-center gap-2 mt-4 md:mt-6">
                <div className="h-1.5 flex-1 bg-black/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${allowancePercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-black/40"
                  />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                    {Math.round(allowancePercentage)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITY & INSIGHTS: Vertical on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <RecentActivity user={user} />

        <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00]">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-sm font-black italic uppercase text-slate-900 dark:text-white">Insights</h3>
          </div>
          
          <div className="space-y-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Your <span className="text-[#FF6B00] font-bold">{currentUnit?.name}</span> protocol is active. 
              {tier === 'family' 
                ? " Manage your household members to distribute your shared allowance." 
                : " Your daily limit is locked based on your worker status."}
            </p>
            
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1"> Status</p>
              <p className="text-lg font-black text-green-500 italic uppercase">Optimized</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <DashboardContent />
    </Suspense>
  );
}