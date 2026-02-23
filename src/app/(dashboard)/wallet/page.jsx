"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import DigitalCard from "@/components/dashboard/wallet/DigitalCard";
import QuickActions from "@/components/dashboard/wallet/QuickActions";
import TransactionHistory from "@/components/dashboard/wallet/TransactionHistory";

export default function WalletPage() {
  const supabase = createClient();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function syncWallet() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [walletRes, historyRes] = await Promise.all([
        supabase.from("wallets").select("balance").eq("user_id", user.id).maybeSingle(),
        supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      ]);

      setBalance(walletRes.data?.balance || 0);
      setTransactions(historyRes.data || []);
      setLoading(false);
    }
    syncWallet();
  }, [supabase]);

  return (
    // FIXED: Removed restrictive padding for mobile, added edge-to-edge safety
    <main className="w-full max-w-5xl mx-auto px-4 md:px-6 pt-6 md:pt-24 pb-32 min-h-screen space-y-8 md:space-y-12">
      
      {/* 1. Header Logic */}
      <div className="flex flex-col gap-1 md:hidden">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Financial Vault</p>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">My Wallet</h1>
      </div>

      {/* 2. Digital Card (The Star of the page) */}
      <section className="w-full">
        <DigitalCard balance={balance} loading={loading} />
      </section>

      {/* 3. Quick Actions (Buttons) */}
      <section className="w-full">
        <QuickActions />
      </section>

      {/* 4. History (The List) */}
      <section className="w-full">
        <TransactionHistory transactions={transactions} />
      </section>
      
    </main>
  );
}