import { Plus, ArrowUpRight, ArrowDownLeft, Settings } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { label: "Top Up", icon: Plus, color: "bg-[#FF6B00] text-white" },
    { label: "Withdraw", icon: ArrowUpRight, color: "bg-white dark:bg-white/5 text-slate-900 dark:text-white" },
    { label: "Transfer", icon: ArrowDownLeft, color: "bg-white dark:bg-white/5 text-slate-900 dark:text-white" },
    { label: "Manage", icon: Settings, color: "bg-white dark:bg-white/5 text-slate-900 dark:text-white" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => (
        <button 
          key={action.label}
          className={`
            ${action.color} flex flex-col items-center justify-center gap-3 py-6 rounded-2xl font-bold text-xs uppercase tracking-wider 
            shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-transparent dark:border-white/5
          `}
        >
          <div className="p-2 rounded-full bg-black/10 dark:bg-white/10">
            <action.icon size={20} />
          </div>
          {action.label}
        </button>
      ))}
    </div>
  );
}