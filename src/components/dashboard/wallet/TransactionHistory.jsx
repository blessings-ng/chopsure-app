// src/components/wallet/TransactionHistory.jsx
import { ArrowUpRight, ArrowDownLeft, History } from "lucide-react";

export default function TransactionHistory({ transactions }) {
  return (
    <div className="mt-16">
      <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-2 mb-8 px-2">
        <History size={20} className="text-[#FF6B00]" />Transaction History
      </h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-[#FF6B00]/20 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                tx.category === 'topup' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {tx.category === 'topup' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
              </div>
              <div>
                <p className="font-black text-xs uppercase text-slate-900 dark:text-white">{tx.description || 'Activity'}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(tx.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <p className={`font-black italic text-lg ${tx.category === 'top-up' ? 'text-green-500' : 'text-red-900 dark:text-red-500'}`}>
              {tx.category === 'topup' ? '+' : '-'}₦{Number(tx.amount).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}