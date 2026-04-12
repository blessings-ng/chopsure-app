"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Bell, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const supabase = createClient();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(true);
  
  // MODAL STATES
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // THE ACTUAL LOGOUT LOGIC
  const confirmLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const initial = firstName ? firstName.charAt(0).toUpperCase() : "U";

  return (
    <>
      <header className="w-full h-20 px-4 sm:px-6 lg:px-10 flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-500">
        <div className="flex items-center gap-3">
          {/* AVATAR SECTION */}
          {loading ? (
            <div className="w-10 h-10 rounded-full animate-pulse bg-slate-200 dark:bg-white/10" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B00] to-orange-400 flex items-center justify-center text-black font-black shadow-lg shadow-orange-500/20 ring-2 ring-white/10 shrink-0">
              {initial}
            </div>
          )}
          
          <div className="hidden sm:block overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Hey,</p>
            <p className="text-sm font-black text-slate-900 dark:text-white capitalize truncate">{firstName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <ThemeToggle />
          <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-[#FF6B00] transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF6B00] rounded-full border-2 border-white dark:border-[#050505]"></span>
          </button>

          {/* TRIGGER MODAL INSTEAD OF AUTO-LOGOUT */}
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-[340px] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl text-center"
            >
              <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LogOut size={24} />
              </div>
              
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2">
                Sign Out?
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-8 leading-relaxed">
                Are you sure you want to log out of your account?
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmLogout}
                  disabled={isLoggingOut}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
                >
                  {isLoggingOut ? <Loader2 className="animate-spin" size={16} /> : "Yes, Log Out"}
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}