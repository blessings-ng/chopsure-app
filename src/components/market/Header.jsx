"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, ArrowLeft, Sun, Moon } from "lucide-react";

export default function Header({ searchQuery, setSearchQuery, cartCount, setIsCartOpen }) {
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
    /* FIXED: Increased z-index to 100 and matched background color exactly to page (bg-[#050505]) */
    <header className="sticky top-0 z-[100] w-full bg-white dark:bg-[#050505] border-b border-slate-200 dark:border-white/10 shadow-md transition-colors duration-500">
      <div className="w-full px-4 py-3 flex items-center justify-between gap-3 bg-white dark:bg-[#050505]">
        {/* Left Section */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/dashboard" className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-base md:text-xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter shrink-0">
            Groceries<span className="text-[#FF6B00]">Mart</span>
          </h1>
        </div>

        {/* Desktop Search */}
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

        {/* Right Section */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-[#FF6B00] transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-all active:scale-90"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#050505]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - Added solid background to prevent bleed-through */}
      <div className="px-4 pb-3 md:hidden w-full bg-white dark:bg-[#050505]">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search raw food..." 
            className="w-full h-10 pl-11 pr-4 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-[#FF6B00] rounded-full outline-none text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}