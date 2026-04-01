"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, ArrowLeft, Sun, Moon, X } from "lucide-react";

export default function Header({ searchQuery, setSearchQuery, cartCount, setIsCartOpen, isCartOpen }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) setIsDark(true);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-[50] w-full bg-white dark:bg-[#050505] border-b border-slate-200 dark:border-white/10 transition-colors duration-500">
      <div className="w-full px-4 py-3 flex items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/dashboard" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-all">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-black italic uppercase text-slate-900 dark:text-white tracking-tighter shrink-0">
            Groceries<span className="text-[#FF6B00]">Mart</span>
          </h1>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search raw food..." 
            className="w-full h-11 pl-12 pr-4 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-[#FF6B00] rounded-2xl outline-none text-sm font-medium transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-[#FF6B00] transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            className={`relative p-2.5 rounded-xl transition-all active:scale-95 shadow-lg ${
              isCartOpen 
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black' 
                : 'bg-[#FF6B00] text-black shadow-orange-500/20'
            }`}
          >
            {isCartOpen ? <X size={18} /> : <ShoppingCart size={18} />}
            
            {cartCount > 0 && !isCartOpen && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-[#050505]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden w-full">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search raw food..." 
            className="w-full h-10 pl-11 pr-4 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-[#FF6B00] rounded-xl outline-none text-xs font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}