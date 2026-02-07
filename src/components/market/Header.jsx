import Link from "next/link";
import { Search, ShoppingCart, ArrowLeft } from "lucide-react";

export default function Header({ searchQuery, setSearchQuery, cartCount, setIsCartOpen }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-slate-600 dark:text-white" />
        </Link>
        <h1 className="text-xl font-black italic uppercase text-slate-900 dark:text-white">
          Raw<span className="text-[#FF6B00]">Mart</span>
        </h1>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search raw food..." 
          className="w-full h-12 pl-12 pr-4 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-[#FF6B00] rounded-full outline-none text-sm font-medium transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button 
        onClick={() => setIsCartOpen(true)}
        className="relative p-3 rounded-full bg-[#FF6B00]/10 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white transition-all group"
      >
        <ShoppingCart size={22} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-black">
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
}