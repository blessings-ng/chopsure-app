import DigitalCard from "@/components/dashboard/wallet/DigitalCard";
import QuickActions from "@/components/dashboard/wallet/QuickActions";
import TransactionHistory from "@/components/dashboard/wallet/TransactionHistory";

export default function WalletPage() {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black italic uppercase text-slate-900 dark:text-white">
          My Wallet
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
          Secure funds for your raw food and daily meals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Card & Actions */}
        <div className="lg:col-span-2 space-y-8">
          <DigitalCard />
          <QuickActions />
        </div>

        {/* Right Column: Stats or Promo (Optional sidebar content) */}
        <div className="hidden lg:block bg-[#FF6B00] rounded-[2rem] p-8 text-white relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="text-2xl font-black italic uppercase mb-4">Auto-Save</h3>
             <p className="text-sm font-medium opacity-90 mb-6 leading-relaxed">
               Did you know? You can set up auto-debit to fund your vault every salary week. Never go hungry.
             </p>
             <button className="w-full py-3 bg-white text-[#FF6B00] font-black uppercase text-xs tracking-wider rounded-xl hover:bg-black hover:text-white transition-colors">
               Enable Auto-Save
             </button>
           </div>
           {/* Decor */}
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
        </div>

      </div>

      {/* Full Width History */}
      <TransactionHistory />

    </div>
  );
}