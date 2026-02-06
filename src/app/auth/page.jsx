"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Lock, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(true);

  // Sync state with URL
  useEffect(() => {
    if (mode === "signup") setIsLogin(false);
    else setIsLogin(true);
  }, [mode]);

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#050505] font-sans selection:bg-[#FF6B00] selection:text-white transition-colors duration-500">
      
      {/* 1. LEFT SIDE - THE FORM SECTION */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white dark:bg-[#050505] transition-colors duration-500 border-r border-slate-100 dark:border-white/5">
        
        {/* Back Link */}
        <Link href="/" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-400 hover:text-[#FF6B00] transition-colors font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft size={14} /> Back Home
        </Link>

        {/* Logo */}
        <div className="mb-8">
           <span className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">
              ChopSure
           </span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            
            {/* --- VIEW: LOGIN --- */}
            {isLogin ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-black italic text-slate-900 dark:text-white uppercase mb-2">Welcome Back</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Access your food vault.</p>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <InputGroup label="Username" type="text" icon={<User size={18}/>} />
                  <InputGroup label="Password" type="password" icon={<Lock size={18}/>} />
                  
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                      <input type="checkbox" className="accent-[#FF6B00]" /> Remember me
                    </label>
                    <a href="#" className="text-[#FF6B00] hover:underline">Forgot Password?</a>
                  </div>

                  <button className="w-full h-14 bg-[#FF6B00] text-white font-black uppercase italic tracking-wider rounded-xl hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all shadow-lg hover:shadow-orange-500/20 active:scale-[0.98]">
                    Secure Login
                  </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-slate-500">
                  Don't have a vault? 
                  <button onClick={() => setIsLogin(false)} className="ml-2 text-[#FF6B00] font-bold hover:underline">Get Access</button>
                </p>
              </motion.div>
            ) : (
              
              /* --- VIEW: REGISTER --- */
              <motion.div 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-black italic text-slate-900 dark:text-white uppercase mb-2">Secure My Month</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Create your food budget plan.</p>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                     <InputGroup label="First Name" type="text" />
                     <InputGroup label="Last Name" type="text" />
                  </div>
                  <InputGroup label="Email Address" type="email" icon={<Mail size={18}/>} />
                  <InputGroup label="Create Password" type="password" icon={<Lock size={18}/>} />
                  
                  <div className="flex gap-3 items-start p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                    <CheckCircle2 size={20} className="text-[#FF6B00] shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      By registering, I agree to lock my budget and receive guaranteed meals from ChopSure partners.
                    </p>
                  </div>

                  <button className="w-full h-14 bg-[#FF6B00] text-white font-black uppercase italic tracking-wider rounded-xl hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all shadow-lg hover:shadow-orange-500/20 active:scale-[0.98]">
                    Create Account
                  </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-slate-500">
                  Already secured? 
                  <button onClick={() => setIsLogin(true)} className="ml-2 text-[#FF6B00] font-bold hover:underline">Login here</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. RIGHT SIDE - THE VISUAL (Sticky Brand Area) */}
      <div className="hidden lg:flex w-[55%] bg-[#0a0a0a] relative overflow-hidden items-center justify-center p-20">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 grayscale"
            alt="Food Texture" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-[#FF6B00]/20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md">
              <CheckCircle2 size={14} /> Guaranteed Meals
           </div>
           
           <h2 className="text-6xl font-black italic text-white uppercase leading-[0.9] tracking-tighter mb-6">
              Don't Starve <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-orange-400">In March.</span>
           </h2>
           
           <p className="text-lg text-white/70 font-medium leading-relaxed mb-10">
              Join thousands of Nigerians who have automated their feeding. Lock your budget once, eat everyday. No stories.
           </p>

           {/* Stats */}
           <div className="flex gap-8 border-t border-white/10 pt-8">
              <div>
                 <p className="text-3xl font-black text-white">12k+</p>
                 <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Users Fed</p>
              </div>
              <div>
                 <p className="text-3xl font-black text-white">99%</p>
                 <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Uptime</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component
function InputGroup({ type, label, icon }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00] transition-colors">
        {icon}
      </div>
      <input 
        type={type} 
        placeholder=" " // Required for label animation
        required
        className={`
          peer w-full h-14 bg-slate-50 dark:bg-white/5 
          border-2 border-slate-100 dark:border-white/5 rounded-xl
          outline-none text-slate-900 dark:text-white font-bold
          transition-all duration-300
          focus:border-[#FF6B00] focus:bg-white dark:focus:bg-black
          ${icon ? 'pl-12' : 'pl-4'} pr-4 pt-4
        `}
      />
      <label className={`
        absolute left-0 pointer-events-none
        text-xs font-bold uppercase tracking-wide text-slate-400
        transition-all duration-300
        peer-focus:text-[10px] peer-focus:top-3 peer-focus:text-[#FF6B00]
        peer-placeholder-shown:text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
        ${icon ? 'peer-focus:left-12 peer-placeholder-shown:left-12' : 'peer-focus:left-4 peer-placeholder-shown:left-4'}
        top-3
      `}>
        {label}
      </label>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 dark:bg-[#050505]"></div>}>
      <AuthContent />
    </Suspense>
  );
}