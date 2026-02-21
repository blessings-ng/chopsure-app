"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function VaultCard({ user }) {
  const supabase = createClient();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getBalance() {
      if (!user) return;
      const { data, error } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (!error && data) setBalance(data.balance);
      setIsLoading(false);
    }
    getBalance();
  }, [user, supabase]);

  const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: 'NGN', maximumFractionDigits: 0
  }).format(balance);

  return (
    <div className="md:col-span-2 bg-[#050505] rounded-[2rem] p-8 relative overflow-hidden text-white shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
        <div className="p-3 bg-white/10 w-fit rounded-xl backdrop-blur-md">
          <CreditCard size={24} className="text-[#FF6B00]" />
        </div>
        <div className="mt-8">
          <p className="text-white/60 font-bold uppercase tracking-widest text-xs mb-1">Locked Budget</p>
          {isLoading ? <Loader2 className="animate-spin text-[#FF6B00]" /> : <h2 className="text-5xl font-black tracking-tighter">{formatted}</h2>}
        </div>
      </div>
    </div>
  );
}