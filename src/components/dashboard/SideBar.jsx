"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, ShoppingBag, Settings, Shield } from "lucide-react";

export default function SideBar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Wallet", path: "/wallet", icon: <Wallet size={20} /> },
    { name: "Subscription", path: "/subscription", icon: <Shield size={20} /> },
    { name: "Market", path: "/market", icon: <ShoppingBag size={20} /> }, // Shortened for Mobile fit
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Kept exactly as your original) */}
      <aside className="w-64 h-screen fixed left-0 top-0 border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050505] hidden lg:flex flex-col z-50 transition-colors duration-500">
        <div className="h-20 flex items-center px-8 border-b border-slate-200 dark:border-white/5">
          <span className="text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">
            ChopSure
          </span>
        </div>

        <div className="flex-1 py-8 px-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.name} 
                href={link.path}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300
                  ${isActive 
                    ? "bg-[#FF6B00] text-white shadow-lg shadow-orange-500/20" 
                    : "text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  }
                `}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* 2. MOBILE BOTTOM NAVIGATION (The "Extraordinary" UX Fix) */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-[#050505] border-t border-slate-200 dark:border-white/10 flex lg:hidden items-center justify-around px-2 z-[100] backdrop-blur-xl">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link 
              key={link.name} 
              href={link.path}
              className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative
                ${isActive ? "text-[#FF6B00]" : "text-slate-400 dark:text-slate-500"}
              `}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute -top-4 w-8 h-1 bg-[#FF6B00] rounded-full shadow-[0_0_10px_#FF6B00]" />
              )}
              
              <div className={`${isActive ? "scale-110" : "scale-100"} transition-transform`}>
                {link.icon}
              </div>
              
              <span className={`text-[8px] font-black uppercase tracking-tighter transition-all
                ${isActive ? "opacity-100" : "opacity-60"}
              `}>
                {link.name === "GroceriesMart" ? "Market" : link.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}