"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, ShieldCheck, LogOut, ChevronRight, Loader2, Smartphone, Mail, Lock, Eye, EyeOff, X } from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Credentials Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Local UI States for toggles
  const [pushEnabled, setPushEnabled] = useState(false); // Default to off based on your preference
  const [emailEnabled, setEmailEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function getSettingsContext() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!session) {
          if (isMounted) router.push("/auth/login");
          return;
        }

        if (isMounted) {
          setUser(session.user);
          setLoading(false);
        }
      } catch (err) {
        console.error("Lock contention bypass on settings frame:", err);
        if (isMounted) setLoading(false);
      }
    }

    getSettingsContext();

    return () => {
      isMounted = false;
    };
  }, [supabase, router]);

  // Handles production password changes using Supabase auth management API
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordFeedback("Password must be at least 6 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordFeedback("");

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordFeedback(error.message);
    } else {
      setPasswordFeedback("Credentials configured successfully!");
      setNewPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordFeedback("");
      }, 1500);
    }
    setIsUpdatingPassword(false);
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-slate-50 dark:bg-[#050505]">
        <Loader2 size={32} className="animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24 px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12">
      
      {/* HEADER */}
      <div className="pt-8 md:pt-12">
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2">User Workspace</p>
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white -ml-1">
          <span className="text-[#FF6B00]">Settings</span>
        </h1>
      </div>

      {/* GRID SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start">
        
        {/* LEFT COLUMN: Profile */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-[#FF6B00] to-orange-400 flex items-center justify-center text-black font-black text-2xl mb-4 shadow-lg shadow-orange-500/20">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900 dark:text-white truncate w-full">Account Identity</h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Personal Details</p>
            </div>

            <div className="space-y-5">
              <div className="min-w-0">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Email Address</label>
                <div className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-4 flex items-center gap-3">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.email}</span>
                </div>
              </div>
              
              <div className="min-w-0">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">System UID</label>
                <div className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-4">
                  <span className="text-[10px] font-mono text-slate-500 truncate block">{user?.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Preferences & Security */}
        <div className="md:col-span-8 flex flex-col gap-6 lg:gap-8">
          
          {/* PREFERENCES SECTION */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] shrink-0">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900 dark:text-white">Communication</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Notification Preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToggleRow icon={<Smartphone size={16} />} title="Push Alerts" subtitle="Device notifications" isActive={pushEnabled} onToggle={() => setPushEnabled(!pushEnabled)} />
              <ToggleRow icon={<Mail size={16} />} title="Email News" subtitle="Weekly reports" isActive={emailEnabled} onToggle={() => setEmailEnabled(!emailEnabled)} />
            </div>
          </div>

          {/* SECURITY & ACTION SECTION */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900 dark:text-white">Protection</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Security Management</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 hover:border-[#FF6B00]/40 transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2.5 bg-white dark:bg-white/10 rounded-xl text-slate-600 dark:text-slate-400 group-hover:text-[#FF6B00] transition-colors"><Lock size={16} /></div>
                  <div className="text-left truncate">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Credentials</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Change Password</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-[#FF6B00] shrink-0" />
              </button>

              <button 
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center justify-between p-5 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-red-500/10 rounded-xl text-red-500 group-hover:bg-white/20 group-hover:text-white transition-all">
                    <LogOut size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-black uppercase tracking-widest">Sign Out</p>
                    <p className="text-[9px] font-bold uppercase opacity-60 mt-0.5">Log out now</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: CHANGE CREDENTIALS */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-[360px] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => { setShowPasswordModal(false); setPasswordFeedback(""); }} 
                className="absolute top-6 right-6 p-2 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-[#FF6B00] rounded-full transition-colors"
              >
                <X size={16} />
              </button>

              <div className="w-14 h-14 bg-[#FF6B00]/10 text-[#FF6B00] rounded-2xl flex items-center justify-center mb-6">
                <Lock size={24} />
              </div>

              <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white text-left mb-1">
                Update Security
              </h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 text-left mb-6">
                Configure account credentials
              </p>

              <form onSubmit={handlePasswordUpdate} className="space-y-5 text-left">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">New Password</label>
                  <div className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 focus-within:border-[#FF6B00]/50 border-2 transition-all">
                    <input 
                      type={showPasswordText ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white w-full"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPasswordText(!showPasswordText)} 
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                      {showPasswordText ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {passwordFeedback && (
                  <p className={`text-[9px] font-black uppercase tracking-wider ${passwordFeedback.includes("success") ? "text-green-500" : "text-red-500"}`}>
                    {passwordFeedback}
                  </p>
                )}

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isUpdatingPassword || !newPassword}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-30"
                  >
                    {isUpdatingPassword ? <Loader2 className="animate-spin" size={14} /> : "Update Credentials"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ARE YOU SURE LOGOUT? */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-[340px] bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                <LogOut size={28} />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2">Sign Out?</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-8 leading-relaxed px-4">Are you sure you want to end your session?</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleSignOut} disabled={isLoggingOut} className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 hover:bg-red-600 transition-all">
                  {isLoggingOut ? <Loader2 className="animate-spin" size={16} /> : "Yes, Log Out"}
                </button>
                <button onClick={() => setShowLogoutModal(false)} disabled={isLoggingOut} className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToggleRow({ icon, title, subtitle, isActive, onToggle }) {
  return (
    <div className="w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="p-2.5 bg-white dark:bg-white/5 rounded-xl text-slate-600 dark:text-slate-400 shrink-0">{icon}</div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white truncate">{title}</p>
          <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5 truncate">{subtitle}</p>
        </div>
      </div>
      <button onClick={onToggle} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ${isActive ? 'bg-[#10B981]' : 'bg-slate-300 dark:bg-slate-700'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-300 ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}