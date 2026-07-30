"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Zap, Briefcase, Users, CheckCircle2, X, ShoppingCart, Lock, ArrowRight, Send, Activity, RefreshCw, AlertTriangle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import VaultCard from "@/components/dashboard/VaultCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import Skeleton from "@/components/dashboard/Skeleton";

const TIER_LIMITS = {
  regular: { daily: 3500 },
  worker: { daily: 8000 },
  family: { daily: 25000 }
};

const SuccessNotice = ({ show, onClose }) => (
  <AnimatePresence>
    {show && (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] md:w-auto"
      >
        <div className="bg-[#10B981] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/20 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <CheckCircle2 size={20} className="shrink-0" />
            <p className="text-xs font-black uppercase tracking-widest italic">Action Successful</p>
          </div>
          <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity shrink-0"><X size={18} /></button>
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
  const [allowanceData, setAllowanceData] = useState({ remaining: 0, total: 1 });
  const [consumptionMode, setConsumptionMode] = useState("cooked");
  const [activeTier, setActiveTier] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUser(user);

      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance, consumption_mode")
        .eq("user_id", user.id)
        .maybeSingle();

      setConsumptionMode(wallet?.consumption_mode || "cooked");

      const metadata = user.user_metadata || {};
      let validTier = null; 

      if (metadata.subscription_tier && metadata.subscription_expiry) {
        if (new Date() < new Date(metadata.subscription_expiry)) {
          validTier = metadata.subscription_tier; 
        }
      }

      setActiveTier(validTier);

      const activeTierLimit = validTier ? TIER_LIMITS[validTier].daily : 0;
      const currentBalance = wallet?.balance || 0;

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", user.id)
        .eq("category", "debit")
        .gte("created_at", startOfDay.toISOString());

      const spentToday = transactions?.reduce((acc, tx) => acc + tx.amount, 0) || 0;
      const remainingAllowance = Math.max(0, activeTierLimit - spentToday);
      
      setAllowanceData({
        remaining: Math.min(currentBalance, remainingAllowance),
        total: activeTierLimit 
      });

      setLoading(false);
    };

    getData();

    if (searchParams.get("status") === "purchase_success" || searchParams.get("status") === "funded") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      router.replace('/dashboard');
    }
  }, [router, supabase, searchParams]);

  const today = new Date();
  const todayDate = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysUntilReset = daysInMonth - todayDate;

  const isMartOpen = (todayDate >= 10 && todayDate <= 13) || (todayDate >= 25 && todayDate <= 28);
  const martNextDate = todayDate < 10 ? "Opens on the 10th" : todayDate <= 13 ? "Closes on the 13th" : todayDate < 25 ? "Opens on the 25th" : "Closes on the 28th";

  const isSubscribed = !!activeTier;

  const unitConfig = {
    regular: { name: "Regular Unit", icon: <Zap size={14} />, theme: "text-slate-400 border-slate-400" },
    worker: { name: "Worker Unit", icon: <Briefcase size={14} className="text-[#FF6B00]" />, theme: "text-[#FF6B00] border-[#FF6B00]" },
    family: { name: "Family Unit", icon: <Users size={14} className="text-purple-500" />, theme: "text-purple-500 border-purple-500" },
    inactive: { name: "Activation Required", icon: <Lock size={14} />, theme: "text-red-500 border-red-500" }
  };
  
  const currentUnit = isSubscribed ? unitConfig[activeTier] : unitConfig.inactive;
  const allowancePercentage = allowanceData.total > 0 ? (allowanceData.remaining / allowanceData.total) * 100 : 0;

  if (loading) return <Skeleton className="h-screen w-full" />;

  return (
    <div className="relative space-y-8 md:space-y-10 pb-16 px-4 md:px-0">
      <SuccessNotice show={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 pt-4">
        <div className="w-full xl:w-auto overflow-hidden">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest bg-white/5 mb-2 ${currentUnit?.theme}`}>
            {currentUnit?.icon} {currentUnit?.name}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white -ml-1">Welcome back!</h1>
        </div>

        <div className="flex flex-row w-full xl:w-auto gap-1.5 sm:gap-2">
          <Link href="/top-up" className="flex-1 min-w-0 flex justify-center items-center px-1 sm:px-5 py-3 sm:py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-[8px] sm:text-[9px] uppercase tracking-widest rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-center whitespace-normal leading-tight">
            Top Up
          </Link>
          
          {consumptionMode === "cooked" && (
            <Link href={isSubscribed ? "/wallet/transfer" : "/subscription"} className={`flex-1 min-w-0 flex justify-center items-center px-1 sm:px-5 py-3 sm:py-3.5 bg-white dark:bg-white/5 border font-black text-[8px] sm:text-[9px] uppercase tracking-widest rounded-xl gap-1 sm:gap-2 transition-colors ${isSubscribed ? 'border-[#FF6B00]/30 text-[#FF6B00] hover:bg-[#FF6B00]/10' : 'border-red-500/30 text-red-500 hover:bg-red-500/10'} text-center whitespace-normal leading-tight`}>
              {isSubscribed ? <Send size={12} className="hidden sm:block shrink-0" /> : <Lock size={12} className="hidden sm:block shrink-0" />} 
              Transfer
            </Link>
          )}

          <Link href="/subscription" className="flex-1 min-w-0 flex justify-center items-center px-1 sm:px-5 py-3 sm:py-3.5 bg-[#FF6B00] text-black font-black text-[8px] sm:text-[9px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-[1.02] transition-all text-center whitespace-normal leading-tight">
            {isSubscribed ? 'Plan Details' : 'Activate Plan'}
          </Link>
        </div>
      </div>

      {/* TOP CARDS GRID - FIXED WITH STRICT FLEXBOX */}
      {/* RESPONSIVE FIX: flex-col on mobile, md:flex-row on big screens with flex-1 on the children */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        
        {/* VAULT CARD - Wrapped to force 50% width on md screens */}
        <div className="flex-1 w-full min-w-0 flex flex-col h-full">
          <VaultCard user={user} />
        </div>

        {/* DAILY ALLOCATION / RAW MART CARD - Wrapped to force 50% width on md screens */}
        <div className="flex-1 w-full min-w-0 flex flex-col h-full">
          {isSubscribed && consumptionMode === "raw" ? (
            <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-xl text-slate-900 dark:text-white h-full">
              <div className="absolute top-0 right-0 p-8 opacity-5"><ShoppingCart size={120} /></div>
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px] md:min-h-[160px]">
                <div>
                  <h2 className="text-3xl min-[360px]:text-4xl md:text-5xl font-black tracking-tighter italic">RAW MART</h2>
                  <p className={`text-[8px] min-[360px]:text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-2 ${isMartOpen ? 'text-[#10B981]' : 'text-[#FF6B00]'}`}>
                    {isMartOpen ? "Checkout Window Active" : `Checkout ${martNextDate}`}
                  </p>
                  <Link href="/market" className="mt-6 inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg bg-[#FF6B00] text-black hover:scale-105 transition-all">
                    Check Mart <ArrowRight size={14} className="ml-2"/>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-xl h-full flex flex-col justify-between ${isSubscribed ? 'bg-[#FF6B00] text-black' : 'bg-slate-100 dark:bg-white/5 border border-red-500/20 text-slate-900 dark:text-white'}`}>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                {isSubscribed ? <ShieldCheck size={120} /> : <Lock size={120} className="text-red-500" />}
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px] md:min-h-[160px]">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-4 sm:mb-0">Daily Allocation</p>
                <div>
                  {isSubscribed ? (
                    <>
                      <h2 className="text-3xl min-[360px]:text-4xl md:text-5xl font-black tracking-tighter italic truncate">₦{Math.floor(allowanceData.remaining).toLocaleString()}</h2>
                      <div className="flex items-center gap-3 mt-4">
                        <div className="h-1.5 flex-1 bg-black/10 rounded-full overflow-hidden">
                          <div style={{ width: `${allowancePercentage}%` }} className="h-full bg-black/40" />
                        </div>
                        <span className="text-[9px] font-black opacity-60 shrink-0">{Math.round(allowancePercentage)}%</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl min-[360px]:text-4xl md:text-5xl font-black tracking-tighter italic text-red-500">₦0</h2>
                      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60 text-red-500">Plan Inactive</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        <div className="w-full lg:col-span-2 overflow-hidden">
          <RecentActivity user={user} />
        </div>
        
        {/* PROTOCOL STATUS BOX */}
        <div className={`bg-white dark:bg-white/5 border rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden h-fit ${isSubscribed ? 'border-slate-100 dark:border-white/10' : 'border-red-500/30'}`}>
          <div className="absolute -top-10 -right-10 opacity-5 rotate-12 pointer-events-none text-[#FF6B00]">
            <Activity size={150} />
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSubscribed ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'bg-red-500/10 text-red-500'}`}>
                {isSubscribed ? <Activity size={20} /> : <AlertTriangle size={20} />}
              </div>
              <h3 className={`text-xs sm:text-sm font-black italic uppercase ${isSubscribed ? 'text-slate-900 dark:text-white' : 'text-red-500'}`}>
                {isSubscribed ? 'Unit Type' : 'Activation Required'}
              </h3>
            </div>
          </div>
          
          <div className="space-y-3 relative z-10">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 min-w-0">
                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">Active Plan</p>
                <p className={`text-xs sm:text-sm font-black italic uppercase truncate ${isSubscribed ? 'text-[#FF6B00]' : 'text-red-500'}`}>
                  {isSubscribed ? activeTier : 'NONE'}
                </p>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 min-w-0">
                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">Mode</p>
                <p className={`text-xs sm:text-sm font-black italic uppercase truncate ${isSubscribed ? (consumptionMode === 'raw' ? 'text-green-500' : 'text-[#FF6B00]') : 'text-slate-500 dark:text-slate-400'}`}>
                  {isSubscribed ? consumptionMode : 'PENDING'}
                </p>
              </div>
            </div>
            
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 min-w-0">
              <div className="w-full sm:w-auto min-w-0">
                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">
                  {consumptionMode === 'raw' ? 'Assigned Limit' : 'Daily Limit'}
                </p>
                <p className={`text-base sm:text-lg font-black italic uppercase truncate ${isSubscribed ? 'dark:text-white' : 'text-red-500'}`}>
                  {!isSubscribed 
                    ? 'LOCKED' 
                    : consumptionMode === 'raw' 
                      ? 'Open Window' 
                      : `₦${allowanceData.total.toLocaleString()}`
                  }
                </p>
              </div>
              {!isSubscribed && (
                <Link href="/subscription" className="w-full sm:w-auto flex justify-center px-5 py-3 sm:py-2 bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-red-500/20 shrink-0">
                  Activate
                </Link>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <DashboardContent />
    </Suspense>
  );
}