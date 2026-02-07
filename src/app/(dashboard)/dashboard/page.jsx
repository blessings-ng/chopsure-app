import Link from "next/link";
import { ArrowUpRight, TrendingUp, Calendar, ShoppingBag, CreditCard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      
      {/* 1. WELCOME SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic uppercase text-slate-900 dark:text-white">
            Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Welcome back, your food budget is <span className="text-green-500 font-bold">Secure</span>.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/market" className="px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
            RawMart
          </Link>
          <button className="px-5 py-2.5 bg-[#FF6B00] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors">
            Top Up Vault
          </button>
        </div>
      </div>

      {/* 2. THE VAULT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Vault Balance */}
        <div className="md:col-span-2 bg-[#050505] rounded-[2rem] p-8 relative overflow-hidden text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                <CreditCard size={24} className="text-[#FF6B00]" />
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">
                Active Plan
              </span>
            </div>
            
            <div>
              <p className="text-white/60 font-bold uppercase tracking-widest text-xs mb-1">Locked Budget</p>
              <h2 className="text-5xl font-black tracking-tighter">₦ 150,000</h2>
              <p className="text-xs text-white/40 mt-2 font-medium">For the month of March</p>
            </div>
          </div>
        </div>

        {/* Daily Allowance */}
        <div className="bg-[#FF6B00] rounded-[2rem] p-8 relative overflow-hidden text-white shadow-xl">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
             <div className="p-3 bg-black/10 w-fit rounded-xl backdrop-blur-md">
                <Calendar size={24} className="text-white" />
             </div>
             
             <div>
               <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-1">Daily Limit</p>
               <h2 className="text-4xl font-black tracking-tighter">₦ 5,300</h2>
               <div className="mt-3 w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                 <div className="h-full bg-white w-[40%]"></div>
               </div>
               <p className="text-[10px] font-bold uppercase tracking-wide mt-2 text-white/80">40% Spent Today</p>
             </div>
          </div>
        </div>
      </div>

      {/* 3. RECENT ACTIVITY & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Transactions List */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black italic uppercase text-slate-900 dark:text-white">Recent Activity</h3>
            <button className="text-xs font-bold text-[#FF6B00] uppercase tracking-wide hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-black/20 hover:bg-slate-100 dark:hover:bg-black/40 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-400 group-hover:text-[#FF6B00] group-hover:scale-110 transition-all">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Raw Mart Purchase</p>
                    <p className="text-xs text-slate-500">2 items • Tuber of Yam, Rice</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 dark:text-white text-sm">- ₦ 4,500</p>
                  <p className="text-xs text-slate-400">10:42 AM</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] p-6 md:p-8">
           <h3 className="text-lg font-black italic uppercase text-slate-900 dark:text-white mb-6">Your Month</h3>
           
           <div className="space-y-6">
              <div>
                 <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
                    <span>Days Covered</span>
                    <span className="text-slate-900 dark:text-white">12 / 30</span>
                 </div>
                 <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF6B00] w-[40%] rounded-full"></div>
                 </div>
              </div>

              <div>
                 <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
                    <span>Savings Goal</span>
                    <span className="text-slate-900 dark:text-white">₦ 20k / 50k</span>
                 </div>
                 <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[60%] rounded-full"></div>
                 </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 mt-4">
                 <div className="flex gap-3">
                    <TrendingUp size={20} className="text-[#FF6B00]" />
                    <div>
                       <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-wide">Insight</p>
                       <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          You are spending 15% less on raw food compared to last month. Keep it up!
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}