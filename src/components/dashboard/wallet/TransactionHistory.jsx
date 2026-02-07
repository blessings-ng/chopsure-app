import { ArrowDownLeft, ArrowUpRight, ShoppingBag } from "lucide-react";

const TRANSACTIONS = [
  { id: 1, type: "out", title: "Raw Mart Purchase", date: "Today, 10:23 AM", amount: "- ₦ 4,500", icon: ShoppingBag, status: "Success" },
  { id: 2, type: "in", title: "Wallet Top Up", date: "Yesterday, 4:00 PM", amount: "+ ₦ 50,000", icon: ArrowDownLeft, status: "Success" },
  { id: 3, type: "out", title: "Meal Plan Debit", date: "Oct 24, 2025", amount: "- ₦ 2,000", icon: ArrowUpRight, status: "Success" },
  { id: 4, type: "out", title: "Withdrawal", date: "Oct 20, 2025", amount: "- ₦ 10,000", icon: ArrowUpRight, status: "Pending" },
];

export default function TransactionHistory() {
  return (
    <div className="bg-white dark:bg-white/5 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black italic uppercase text-slate-900 dark:text-white">Recent Transactions</h3>
        <button className="text-xs font-bold text-[#FF6B00] uppercase tracking-wide hover:underline">View All</button>
      </div>

      <div className="space-y-3">
        {TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-black/20 hover:bg-slate-100 dark:hover:bg-black/40 transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${tx.type === 'in' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
              `}>
                <tx.icon size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{tx.title}</p>
                <p className="text-xs text-slate-500">{tx.date}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-black text-sm ${tx.type === 'in' ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}>
                {tx.amount}
              </p>
              <span className={`
                text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                ${tx.status === 'Success' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}
              `}>
                {tx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}