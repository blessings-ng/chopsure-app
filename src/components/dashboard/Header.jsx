"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Bell } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const supabase = createClient();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFirstName(user.user_metadata?.first_name || "User");
      }
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const initial = firstName ? firstName.charAt(0).toUpperCase() : "U";

  return (
    <header className="w-full h-20 px-6 lg:px-10 flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-500">
      <div className="flex items-center gap-3">
        {/* AVATAR SECTION */}
        {loading ? (
          <div className="w-10 h-10 rounded-full animate-pulse bg-slate-200 dark:bg-white/10" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B00] to-orange-400 flex items-center justify-center text-black font-black shadow-lg shadow-orange-500/20 ring-2 ring-white/10">
            {initial}
          </div>
        )}
        
        <div className="hidden md:block">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Hey,</p>
          <p className="text-sm font-black text-slate-900 dark:text-white capitalize">{firstName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <ThemeToggle />
        <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-[#FF6B00] transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B00] rounded-full border-2 border-white dark:border-[#050505]"></span>
        </button>
        <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}