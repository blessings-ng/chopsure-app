"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Wallet, Settings, LogOut, UtensilsCrossed } from "lucide-react";

const LINKS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Raw Mart", href: "/market", icon: ShoppingBag }, // Links to your Mini Mart
  { name: "Meal Plan", href: "/meals", icon: UtensilsCrossed },
  { name: "Wallet", href: "/wallet", icon: Wallet },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 h-screen flex-col bg-[#050505] border-r border-white/5 fixed left-0 top-0 z-30">
      
      {/* Brand */}
      <div className="p-8">
        <h1 className="text-2xl font-black italic uppercase text-white tracking-tighter">
          Chop<span className="text-[#FF6B00]">Sure</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {LINKS.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group
                ${isActive 
                  ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <Icon size={18} className={isActive ? "text-white" : "group-hover:text-[#FF6B00] transition-colors"} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}