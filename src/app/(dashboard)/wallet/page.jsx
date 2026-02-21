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
    <main className="max-w-4xl mx-auto p-6 pt-24 min-h-screen">
      <DigitalCard balance={balance} loading={loading} />
      <QuickActions />
      <TransactionHistory transactions={transactions} />
    </main>
  );
}