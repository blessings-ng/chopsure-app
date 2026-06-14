"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Wallet, Shield, Loader2, ArrowUpRight, ArrowDownLeft, Sparkles } from "lucide-react";

export default function NotificationsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchWithRetry(retries = 3, delay = 100) {
      try {
        // 1. Fetch Session instead of getUser to bypass Navigator LockManager block
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (isMounted) router.push("/auth/login");
          return;
        }

        const currentUserId = session.user.id;

        // 2. Fetch real-time transactional activity streams
        const { data: transactions, error } = await supabase
          .from("transactions")
          .select("id, amount, category, description, status, created_at, reference")
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (transactions && isMounted) {
          const mappedLogs = transactions.map((tx) => {
            let logTheme = {
              title: tx.description || "Account Activity Processed",
              icon: <Sparkles size={16} className="text-[#FF6B00]" />,
              bg: "bg-[#FF6B00]/5 border-[#FF6B00]/10"
            };

            if (tx.category === "debit") {
              logTheme = {
                title: "Payment Checkout Confirmed",
                icon: <ArrowUpRight size={16} className="text-red-500" />,
                bg: "bg-red-500/5 border-red-500/10"
              };
            } else if (tx.category === "credit" || tx.category === "funded") {
              logTheme = {
                title: "Inbound Funding Received",
                icon: <ArrowDownLeft size={16} className="text-[#10B981]" />,
                bg: "bg-[#10B981]/5 border-[#10B981]/10"
              };
            } else if (tx.category === "subscription") {
              logTheme = {
                title: "Allocation Configuration Updated",
                icon: <Shield size={16} className="text-blue-500" />,
                bg: "bg-blue-500/5 border-blue-500/10"
              };
            }

            const formattedTime = new Date(tx.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            });

            return {
              id: tx.id,
              title: logTheme.title,
              desc: tx.description || `Transaction ref: ${tx.reference}`,
              amount: tx.amount,
              category: tx.category,
              time: formattedTime.toUpperCase(),
              icon: logTheme.icon,
              bg: logTheme.bg
            };
          });

          setActivities(mappedLogs);
        }
        
        if (isMounted) setLoading(false);

      } catch (err) {
        console.error("Lock contention caught, retrying sequence...", err);
        if (retries > 0 && isMounted) {
          setTimeout(() => fetchWithRetry(retries - 1, delay * 2), delay);
        } else {
          if (isMounted) setLoading(false);
        }
      }
    }

    fetchWithRetry();

    return () => {
      isMounted = false;
    };
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-slate-50 dark:bg-[#050505]">
        <Loader2 size={32} className="animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24 px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12">
      
      {/* HEADER */}
      <div className="pt-8 md:pt-12">
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2">Integrated Streams</p>
      </div>

      {/* FEED TRACKER */}
      <div className="w-full max-w-[800px]">
        <AnimatePresence mode="popLayout">
          {activities.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-12 text-center shadow-sm"
            >
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell size={24} />
              </div>
              <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900 dark:text-white">Logs Empty</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">No dynamic account actions found in the ledger pipeline.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {activities.map((log) => (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 sm:p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 transition-all flex items-start gap-4 shadow-sm relative overflow-hidden"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${log.bg}`}>
                    {log.icon}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white truncate">
                        {log.title}
                      </h4>
                      <span className="text-[8px] font-black text-slate-400 tracking-wider whitespace-nowrap uppercase">
                        {log.time}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed capitalize">
                      {log.desc.replace(/vault/gi, "account balance")}
                    </p>
                    <div className="mt-2 text-[10px] font-black italic tracking-tight text-slate-900 dark:text-white">
                      {log.category === "credit" || log.category === "funded" ? "+" : "-"}₦{log.amount.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}