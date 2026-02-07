import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md sticky top-0 z-20 px-6 md:px-10 flex items-center justify-between">
      
      {/* Search (Hidden on small mobile) */}
      <div className="hidden md:flex items-center gap-3 bg-slate-100 dark:bg-white/5 px-4 py-2.5 rounded-full w-96 border border-transparent focus-within:border-[#FF6B00] transition-colors">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search transactions, meals..." 
          className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 dark:text-white w-full placeholder:text-slate-400"
        />
      </div>

      {/* Mobile Title (Visible only on mobile) */}
      <div className="md:hidden">
        <span className="font-black italic uppercase text-slate-900 dark:text-white">Dashboard</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Blessing Igwe</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]">Premium Plan</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B00] to-orange-400 p-[2px]">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Blessing" 
              alt="User" 
              className="w-full h-full rounded-full bg-black"
            />
          </div>
        </div>
      </div>
    </header>
  );
}