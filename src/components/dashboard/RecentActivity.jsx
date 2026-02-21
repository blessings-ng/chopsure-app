"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function RecentActivity({ user }) {
  const supabase = createClient();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTransactions() {
      if (!user) return;
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error) setTransactions(data);
      setLoading(false);
    }
    getTransactions();
  }, [user, supabase]);

  if (loading) return (
    <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] p-8 flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-[#FF6B00]" />
    </div>
  );

  return (
    <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black italic uppercase text-slate-900 dark:text-white">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-50 dark:border-white/5 rounded-[1.5rem]">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No transactions found.</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-[#FF6B00]/20 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Dynamic Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.category === 'topup' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {tx.category === 'topup' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>

                <div>
                  {/* Logic for Credited vs Debited */}
                  <p className="font-black text-[11px] uppercase tracking-tight text-slate-900 dark:text-white leading-none">
                    {tx.category === 'topup' ? 'Credited' : 'Debited'}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                    {new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Amount Label */}
              <p className={`font-black italic text-sm ${
                tx.category === 'topup' ? 'text-green-500' : 'text-red-900 dark:text-red-500'
              }`}>
                {tx.category === 'topup' ? '+' : '-'}₦{Number(tx.amount).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}