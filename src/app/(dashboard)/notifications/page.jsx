"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Bell, CheckCheck, Loader2, ArrowDownLeft, ArrowUpRight, Shield, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Framer Motion constraints
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

// Vanilla JS Time Formatter (No external libraries needed)
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function NotificationsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'unread'
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotifications(data);
      }
      setLoading(false);
    };

    fetchNotifications();

    // Optional: Set up real-time listener for new notifications
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, 
        (payload) => setNotifications(prev => [payload.new, ...prev]))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [router, supabase]);

  const handleMarkAsRead = async (id) => {
    // Optimistic UI update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    
    if (unreadIds.length === 0) {
      setMarkingAll(false);
      return;
    }

    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    setMarkingAll(false);
  };

  const filteredNotifications = notifications.filter(n => 
    activeTab === "unread" ? !n.is_read : true
  );

  const getIcon = (type) => {
    switch (type) {
      case 'credit': return <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0"><ArrowDownLeft size={18} /></div>;
      case 'debit': return <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0"><ArrowUpRight size={18} /></div>;
      case 'security': return <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0"><Shield size={18} /></div>;
      default: return <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center shrink-0"><Info size={18} /></div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] w-full bg-slate-50 dark:bg-[#0a0a0a] flex justify-center items-center">
        <Loader2 size={32} className="animate-spin text-[#FF6B00]"/>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 dark:bg-[#0a0a0a] flex flex-col items-center pt-6 sm:pt-10 pb-20 px-0 sm:px-6">
      
      {/* TIGHT, CENTERED CONTAINER */}
      <div className="w-full max-w-[650px] flex flex-col px-4 sm:px-0">
        
        {/* HEADER SECTION */}
        <div className="sticky top-0 z-10 bg-slate-50/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md pt-2 pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors text-slate-900 dark:text-white">
              <ArrowLeft size={16}/>
            </Link>
            
            <button 
              onClick={handleMarkAllAsRead}
              disabled={markingAll || !notifications.some(n => !n.is_read)}
              className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-[#FF6B00] transition-colors disabled:opacity-40 disabled:hover:text-slate-500"
            >
              {markingAll ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
              Mark all read
            </button>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white -ml-0.5">
                Alerts
              </h1>
            </div>
            
            {/* TOGGLE TABS */}
            <div className="flex bg-slate-200 dark:bg-white/5 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab("all")}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab("unread")}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${activeTab === 'unread' ? 'bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Unread
                {notifications.some(n => !n.is_read) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="pt-4">
          {filteredNotifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center py-20 px-4"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4 text-slate-400">
                {activeTab === 'unread' ? <CheckCircle2 size={24} /> : <Bell size={24} />}
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                {activeTab === 'unread' ? "You're all caught up!" : "No Notifications"}
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2 max-w-[250px]">
                {activeTab === 'unread' ? "You have no new alerts to review at this time." : "We'll notify you when there's activity on your account."}
              </p>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-3">
              <AnimatePresence>
                {filteredNotifications.map((notif) => (
                  <motion.div 
                    key={notif.id}
                    variants={itemVariants}
                    layout
                    onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                    className={`relative p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group ${
                      notif.is_read 
                        ? 'bg-white dark:bg-[#111] border-slate-200 dark:border-white/5 opacity-70 hover:opacity-100' 
                        : 'bg-white dark:bg-[#161616] border-slate-300 dark:border-white/10 shadow-sm shadow-orange-500/5 hover:border-[#FF6B00]/30'
                    }`}
                  >
                    {!notif.is_read && (
                      <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-[#FF6B00] shadow-[0_0_8px_rgba(255,107,0,0.6)]"></div>
                    )}
                    
                    <div className="flex gap-4">
                      {getIcon(notif.type)}
                      <div className="flex-1 pr-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${notif.is_read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                            {notif.title}
                          </h4>
                        </div>
                        <p className={`text-[10px] sm:text-xs font-medium leading-relaxed ${notif.is_read ? 'text-slate-500 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'}`}>
                          {notif.message}
                        </p>
                        <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-3">
                          {formatTimeAgo(notif.created_at)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}