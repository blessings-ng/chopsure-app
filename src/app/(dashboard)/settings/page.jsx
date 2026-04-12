"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { User, Bell, ShieldCheck, LogOut, ChevronRight, Loader2, Smartphone, Mail, Lock } from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Local UI State for toggles (Requires no backend review!)
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);
      setLoading(false);
    }
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden pb-20 px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10">
      
      {/* HEADER */}
      <div className="pt-8 sm:pt-12">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white -ml-1">
          <span className="text-[#FF6B00]">Settings</span>
        </h1>
      </div>

      {/* GRID LAYOUT: Stacks on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
        
        {/* COLUMN 1: Profile & Support */}
        <div className="flex flex-col gap-6 md:gap-8 w-full min-w-0">
          
          {/* PROFILE CARD */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 w-full shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white shrink-0">
                <User size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900 dark:text-white truncate">Profile</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Identity Details</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="w-full min-w-0">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Registered Email</label>
                <div className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 sm:py-4 flex items-center gap-3">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email || "No email found"}</span>
                </div>
              </div>
              
              <div className="w-full min-w-0">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">User ID</label>
                <div className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 sm:py-4">
                  <span className="text-[10px] sm:text-xs font-mono text-slate-500 truncate block">{user?.id || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 2 & 3: Preferences & Security */}
        <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8 w-full min-w-0">
          
          {/* PREFERENCES CARD */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 w-full shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] shrink-0">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900 dark:text-white">Notifications</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Manage Alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleRow 
                icon={<Smartphone size={16} />} 
                title="Push Notifications" 
                subtitle="Receive alerts on your device"
                isActive={pushEnabled}
                onToggle={() => setPushEnabled(!pushEnabled)}
              />
              <ToggleRow 
                icon={<Mail size={16} />} 
                title="Email Updates" 
                subtitle="Marketing & Weekly summaries"
                isActive={emailEnabled}
                onToggle={() => setEmailEnabled(!emailEnabled)}
              />
            </div>
          </div>

          {/* SECURITY & DANGER ZONE */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 w-full shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900 dark:text-white">Security</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Account Access</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-white/5 rounded-lg text-slate-600 dark:text-slate-400 group-hover:text-[#FF6B00] transition-colors shrink-0">
                    <Lock size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Change Password</p>
                    <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">Update your credentials</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-[#FF6B00] transition-colors shrink-0" />
              </button>

              <button 
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-500 shrink-0">
                    {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest text-red-500">Sign Out</p>
                    <p className="text-[9px] font-bold tracking-widest text-red-500/60 uppercase mt-0.5">End current session</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Custom Toggle Switch Component (Fully Responsive)
function ToggleRow({ icon, title, subtitle, isActive, onToggle }) {
  return (
    <div className="w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 min-w-0 gap-4">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <div className="p-2 bg-white dark:bg-white/5 rounded-lg text-slate-600 dark:text-slate-400 shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white truncate">{title}</p>
          <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5 truncate">{subtitle}</p>
        </div>
      </div>
      
      {/* Custom Switch Logic */}
      <button 
        onClick={onToggle}
        className={`relative inline-flex h-6 sm:h-7 w-11 sm:w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none ${isActive ? 'bg-[#10B981]' : 'bg-slate-300 dark:bg-slate-700'}`}
      >
        <span 
          className={`inline-block h-4 sm:h-5 w-4 sm:w-5 transform rounded-full bg-white shadow-lg transition duration-300 ${isActive ? 'translate-x-6 sm:translate-x-6' : 'translate-x-1 sm:translate-x-1'}`} 
        />
      </button>
    </div>
  );
}