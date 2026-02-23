// src/components/wallet/TransactionHistory.jsx
import { ArrowUpRight, ArrowDownLeft, History } from "lucide-react";

export default function TransactionHistory({ transactions }) {
  if (!transactions) return null;

  return (
    <div className="mt-10 md:mt-16 px-2 md:px-0">
      <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-2 mb-8 px-2 text-slate-900 dark:text-white">
        <History size={20} className="text-[#FF6B00]" />Transaction History
      </h3>
      
      <div className="space-y-3 pb-24">
        {transactions.map((tx) => {
          // Internal check to ensure consistency
          const isCredit = tx.category === 'topup' || tx.category === 'top-up';

          return (
            <div key={tx.id} className="flex items-center justify-between p-4 md:p-6 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-transparent hover:border-[#FF6B00]/20 transition-all">
              <div className="flex items-center gap-4 overflow-hidden">
                {/* ICON BOX COLOR */}
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${
                  isCredit ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {isCredit ? (
                    <ArrowDownLeft className="w-5 h-5" /> 
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div className="truncate">
                  <p className="font-black text-[10px] md:text-xs uppercase text-slate-900 dark:text-white truncate pr-1">
                    {tx.description || 'Activity'}
                  </p>
                  <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* AMOUNT COLOR: Now correctly checks for Credit vs Debit */}
              <p className={`font-black italic text-sm md:text-lg shrink-0 ml-2 ${
                isCredit ? 'text-green-500' : 'text-red-900 dark:text-red-500'
              }`}>
                {isCredit ? '+' : '-'}₦{Number(tx.amount).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}