"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Lock, LogOut, CheckCircle2, X, Shield, 
  Smartphone, Mail, Loader2, Camera, Bell, Trash2, ChevronRight, AlertTriangle, Eye, EyeOff, HelpCircle, MessageSquare, ChevronDown
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Skeleton from "@/components/dashboard/Skeleton";
import Link from "next/link";

const faqData = [
  { q: "How does the daily allocation system work?", a: "Your allocation resets every 24 hours at midnight. It is calculated based on your current tier and previous account activity to ensure optimal liquidity for your operations." },
  { q: "What defines a 'Raw Mart' window?", a: "These are high-velocity trading periods where market spreads are at their absolute narrowest. You will receive real-time push notifications the moment a window opens to ensure you can execute trades with maximum efficiency." },
  { q: "How is my capital protected?", a: "We utilize multi-layered encryption for all wallet balances. Funds are held in segregated accounts, and our system performs 24/7 automated auditing to prevent unauthorized movement." },
  { q: "What if a transaction stays pending?", a: "Most transactions settle within seconds. If a transaction remains 'pending' for more than 5 minutes, our system automatically initiates a background reconciliation. No manual action is required on your part; we will notify you once the status is updated." }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Notice = ({ show, message, type = "success", onClose }) => (
  <AnimatePresence>
    {show && (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] sm:w-auto"
      >
        <div className={`${type === 'success' ? 'bg-[#10B981]' : 'bg-red-500'} text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-between gap-4 border border-white/20`}>
          <div className="flex items-center gap-2">
            {type === 'success' ? <CheckCircle2 size={16} /> : <X size={16} />}
            <p className="text-[10px] font-black uppercase tracking-widest italic">{message}</p>
          </div>
          <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity shrink-0">
            <X size={14} />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState({ show: false, message: "", type: "success" });
  const [showPassword, setShowPassword] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const [profileData, setProfileData] = useState({ firstName: "", lastName: "", phone: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const [pushPrefs, setPushPrefs] = useState({
    allocations: true,
    mart: true
  });
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/auth/login");
        return;
      }
      
      const meta = session.user.user_metadata;
      setUser(session.user);
      setProfileData({
        firstName: meta?.first_name || "",
        lastName: meta?.last_name || "",
        phone: meta?.phone || "",
      });
      setAvatarUrl(meta?.avatar_url || null);
      
      if (meta?.push_prefs) {
        setPushPrefs(meta.push_prefs);
      }
      
      setLoading(false);
    };
    getUser();
  }, [router, supabase]);

  const showNotification = (message, type = "success") => {
    setNotice({ show: true, message, type });
    setTimeout(() => setNotice({ show: false, message: "", type: "success" }), 3000);
  };

  const handleAvatarUpload = async (e) => {
    try {
      setUploadingAvatar(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const { error: updateError } = await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      if (updateError) throw updateError;
      
      setAvatarUrl(publicUrl);
      showNotification("Profile picture updated");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setUploadingAvatar(true);
      const { error } = await supabase.auth.updateUser({ data: { avatar_url: null } });
      if (error) throw error;
      
      setAvatarUrl(null);
      showNotification("Profile picture removed");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleTogglePush = async (key) => {
    const newPrefs = { ...pushPrefs, [key]: !pushPrefs[key] };
    setPushPrefs(newPrefs); 
    
    const { error } = await supabase.auth.updateUser({
      data: { push_prefs: newPrefs }
    });
    
    if (error) {
      setPushPrefs(pushPrefs); 
      showNotification("Failed to update preferences", "error");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({
      data: { first_name: profileData.firstName, last_name: profileData.lastName, phone: profileData.phone }
    });
    setSavingProfile(false);
    if (error) showNotification(error.message, "error");
    else showNotification("Profile updated");
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showNotification("New passwords do not match", "error");
    }
    if (passwordData.newPassword.length < 6) {
      return showNotification("New password must be at least 6 characters", "error");
    }

    setSavingPassword(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: passwordData.currentPassword,
    });

    if (signInError) {
      setSavingPassword(false);
      return showNotification("Incorrect current password", "error");
    }

    const { error: updateError } = await supabase.auth.updateUser({ 
      password: passwordData.newPassword 
    });
    
    setSavingPassword(false);

    if (updateError) {
      showNotification(updateError.message, "error");
    } else {
      showNotification("Password updated securely");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsPasswordModalOpen(false);
    }
  };

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) return <Skeleton className="h-screen w-full" />;

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative pb-10 px-4 sm:px-6 lg:px-8 w-full max-w-[1200px] mx-auto space-y-6"
      >
        <Notice show={notice.show} message={notice.message} type={notice.type} onClose={() => setNotice({ ...notice, show: false })} />

        <motion.div variants={itemVariants} className="pt-6 pb-2 border-b border-slate-200 dark:border-white/10">
          <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white -ml-0.5">
            Settings
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <motion.div variants={itemVariants} className="lg:col-span-7 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
                <User size={16} className="text-[#FF6B00]" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Profile Details</h2>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Manage your identity</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                <div className="relative w-16 h-16 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                  {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User size={24} className="text-slate-300 dark:text-slate-500" />}
                  {uploadingAvatar && <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"><Loader2 size={16} className="animate-spin text-white" /></div>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 hover:border-[#FF6B00]/40 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white transition-colors shadow-sm">
                    <Camera size={12} className="mr-2" /> Change Photo
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                  </label>
                  {avatarUrl && (
                    <button type="button" onClick={handleDeleteAvatar} disabled={uploadingAvatar} className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors shadow-sm">
                      <Trash2 size={12} className="mr-2" /> Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} placeholder="First Name" className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:border-[#FF6B00] outline-none transition-all" />
                <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} placeholder="Last Name" className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:border-[#FF6B00] outline-none transition-all" />
              </div>
              <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="Phone Number" className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:border-[#FF6B00] outline-none transition-all" />
              
              <button type="submit" disabled={savingProfile} className="w-full sm:w-auto px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#FF6B00] dark:hover:bg-[#FF6B00] hover:text-white transition-colors disabled:opacity-70 flex justify-center items-center">
                {savingProfile ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
              </button>
            </form>
          </motion.div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
                  <Bell size={16} className="text-[#FF6B00]" />
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Notifications</h2>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Manage your alerts</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Daily Allocations</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Updates on balance resets</p>
                  </div>
                  <button onClick={() => handleTogglePush('allocations')} className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${pushPrefs.allocations ? 'bg-[#FF6B00]' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${pushPrefs.allocations ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Raw Mart Windows</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Alerts when mart opens</p>
                  </div>
                  <button onClick={() => handleTogglePush('mart')} className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${pushPrefs.mart ? 'bg-[#FF6B00]' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${pushPrefs.mart ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-black/40 flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-slate-600 dark:text-slate-300" />
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Security & Access</h2>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Protect your account</p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 hover:border-[#FF6B00]/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Lock size={16} className="text-slate-400 group-hover:text-[#FF6B00] transition-colors" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Change Password</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </button>

                {/* FAQ DROPDOWN */}
                <div className="bg-slate-50 dark:bg-black/20 rounded-xl overflow-hidden border border-slate-100 dark:border-white/5">
                  <button onClick={() => setIsFaqOpen(!isFaqOpen)} className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <HelpCircle size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Help & FAQ</span>
                    </div>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isFaqOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isFaqOpen && (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: "auto" }} 
                        exit={{ height: 0 }} 
                        className="px-4 pb-4 space-y-4"
                      >
                        {faqData.map((item, idx) => (
                          <div key={idx} className="pt-4 border-t border-slate-200 dark:border-white/10 first:border-0 first:pt-2">
                            <p className="text-[9px] font-black uppercase text-[#FF6B00] mb-1">{item.q}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.a}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/contact" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 hover:border-[#FF6B00]/40 transition-colors group">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} className="text-slate-400 group-hover:text-[#FF6B00] transition-colors" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Contact Us</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>

                <button 
                  onClick={() => setIsLogoutModalOpen(true)} 
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={16} className="text-red-500" />
                    <span className="text-xs font-bold text-red-500">Sign Out</span>
                  </div>
                  <ChevronRight size={16} className="text-red-400" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* PASSWORD MODAL */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPasswordModalOpen(false)} className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[100] p-4 flex items-center justify-center">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 w-full max-w-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black uppercase">Update Password</h3>
                <button onClick={() => setIsPasswordModalOpen(false)}><X size={16}/></button>
              </div>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <input type={showPassword ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-white/5 border rounded-xl text-xs" placeholder="Current Password" required />
                <div className="h-px bg-slate-200 dark:bg-white/10 my-2" />
                <input type={showPassword ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-white/5 border rounded-xl text-xs" placeholder="New Password" required />
                <input type={showPassword ? "text" : "password"} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-white/5 border rounded-xl text-xs" placeholder="Confirm New Password" required />
                <button type="submit" className="w-full py-3 bg-[#FF6B00] text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-colors">Confirm Update</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGOUT MODAL */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLogoutModalOpen(false)} className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[100] p-4 flex items-center justify-center">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 w-full max-w-[360px] text-center">
              <AlertTriangle size={32} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-black uppercase tracking-wider mb-2">Sign Out?</h3>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-white/5 rounded-xl font-black text-[10px] uppercase">Cancel</button>
                <button onClick={handleConfirmLogout} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase">Sign Out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}