"use client";

import Link from "next/link";
import { User, Lock, Mail, ArrowLeft, CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react"; // Added useEffect
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Check for errors passed in the URL (like from an expired email link)
  useEffect(() => {
    const errorType = searchParams.get("error");
    if (errorType === "auth_code_error" || errorType === "link_expired") {
      setError("The verification link has expired. Please log in to request a new one.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      setShowToast(true);
      setTimeout(() => {
        router.push("/dashboard"); 
      }, 2000);
      
    } catch (err) {
      console.error("Login error:", err);
      
      // SPECIFIC ERROR HANDLING
      if (err.message.includes("Email not confirmed")) {
        setError("Your email hasn't been verified yet. Please check your inbox.");
      } else if (err.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(err.message);
      }
      
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email.length > 0 && formData.password.length > 0 && !isLoading;

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#050505] font-sans selection:bg-[#FF6B00] selection:text-white transition-colors duration-500 relative overflow-hidden">
      
      {/* 1. LEFT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white dark:bg-[#050505] transition-colors duration-500 border-r border-slate-100 dark:border-white/5">
        
        <Link href="/" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-400 hover:text-[#FF6B00] transition-colors font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft size={14} /> Go Back
        </Link>

        <div className="mb-8">
          <span className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">
            ChopSure
          </span>
        </div>

        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-black italic text-slate-900 dark:text-white uppercase mb-2">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Access your food vault.</p>

            {/* ERROR MESSAGE DISPLAY */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500 text-xs font-bold uppercase tracking-wide overflow-hidden"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" /> 
                  <span className="leading-relaxed">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <InputGroup label="Email Address" name="email" type="email" icon={<Mail size={18}/>} onChange={handleChange} />
              <PasswordInputGroup label="Password" name="password" onChange={handleChange} />
              
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  <input type="checkbox" className="accent-[#FF6B00]" /> Remember me
                </label>
                <Link href="#" className="text-[#FF6B00] hover:underline">Forgot Password?</Link>
              </div>

              <button 
                type="submit" 
                disabled={!isFormValid}
                className={`relative w-full h-11 border-2 rounded-full font-bold uppercase tracking-wider overflow-hidden group transition-all mt-4 
                  ${isFormValid 
                    ? "bg-transparent border-[#FF6B00] text-[#FF6B00] dark:text-white hover:text-white cursor-pointer" 
                    : "bg-slate-100 dark:bg-white/10 border-transparent text-slate-400 cursor-not-allowed"
                  }
                `}
              >
                {isFormValid && (
                  <span className="absolute inset-0 w-full h-full bg-[#FF6B00] translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 -z-10"></span>
                )}
                <span className="relative z-10">{isLoading ? "Authenticating..." : "Secure Login"}</span>
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
              Don't have a vault? 
              <Link href="/auth/signup" className="ml-2 text-[#FF6B00] font-bold hover:underline">
                Get Access
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* 2. RIGHT SIDE - VISUAL */}
      <div className="hidden lg:flex w-[55%] bg-[#0a0a0a] relative overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 grayscale"
            alt="Food Texture" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-[#FF6B00]/20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 max-w-lg">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md">
              <CheckCircle2 size={14} /> Guaranteed Meals
           </div>
           <h2 className="text-6xl font-black italic text-white uppercase leading-[0.9] tracking-tighter mb-6">
              Don't Starve <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-orange-400">In March.</span>
           </h2>
           <p className="text-lg text-white/70 font-medium leading-relaxed mb-10">
              Access your secured budget. Your food is safe, your belly is secured.
           </p>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 right-4 md:right-10 z-[100] bg-[#10B981] p-1 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.3)]"
          >
            <div className="bg-[#050505] rounded-xl px-6 py-4 flex items-center gap-4 border border-[#10B981]/30">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="text-white font-black italic uppercase tracking-wider text-sm md:text-base leading-none mb-1">
                  Access Granted.
                </h4>
                <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  Opening Vault...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// REUSABLE INPUTS
function InputGroup({ label, name, type, icon, onChange }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00] transition-colors">
        {icon}
      </div>
      <input 
        type={type} 
        name={name}
        onChange={onChange}
        placeholder=" " 
        required
        className={`peer w-full h-14 bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/5 rounded-xl outline-none text-slate-900 dark:text-white font-bold transition-all duration-300 focus:border-[#FF6B00] focus:bg-white dark:focus:bg-black ${icon ? 'pl-12' : 'pl-4'} pr-4 pt-4`}
      />
      <label className={`absolute left-0 pointer-events-none text-xs font-bold uppercase tracking-wide text-slate-400 transition-all duration-300 peer-focus:text-[10px] peer-focus:top-3 peer-focus:text-[#FF6B00] peer-placeholder-shown:text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 ${icon ? 'peer-focus:left-12 peer-placeholder-shown:left-12' : 'peer-focus:left-4 peer-placeholder-shown:left-4'} top-3`}>
        {label}
      </label>
    </div>
  );
}

function PasswordInputGroup({ label, name, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 group-focus-within:text-[#FF6B00]">
        <Lock size={18} />
      </div>
      <input 
        type={showPassword ? "text" : "password"} 
        name={name} 
        onChange={onChange} 
        placeholder=" " 
        required 
        className="peer w-full h-14 bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/5 focus:border-[#FF6B00] rounded-xl outline-none text-slate-900 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-black pl-12 pr-12 pt-4" 
      />
      <label className="absolute left-12 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wide pointer-events-none transition-all peer-focus:text-[10px] peer-focus:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-12 top-3 text-slate-400 peer-focus:text-[#FF6B00]">
        {label}
      </label>
      <button 
        type="button" 
        onClick={() => setShowPassword(!showPassword)} 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#FF6B00] transition-colors"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}