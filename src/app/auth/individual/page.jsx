"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Lock, Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function IndividualAuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(true);

  // Sync state with URL
  useEffect(() => {
    if (mode === "signup") setIsLogin(false);
    else setIsLogin(true);
  }, [mode]);

  return (
    <div className="min-h-screen w-full flex bg-[#050505] font-sans selection:bg-[#FF6B00] selection:text-white overflow-hidden">
      
      {/* 1. LEFT SIDE - THE FORM (Clean, Minimal, Dark) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-20 border-r border-white/5 bg-[#050505]">
        
        {/* Back Link */}
        <Link href="/auth" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-white/30 hover:text-[#FF6B00] transition-colors font-black uppercase tracking-widest text-[10px] group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Selection
        </Link>

        {/* LOGO */}
        <div className="mb-12">
           <span className="text-3xl font-black italic tracking-tighter text-white uppercase">
              Chop<span className="text-[#FF6B00]">Sure</span>
           </span>
        </div>

        {/* FORM CONTAINER */}
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
                <div className="mb-10">
                  <h1 className="text-4xl md:text-5xl font-black italic text-white uppercase mb-2 tracking-tighter">
                    Access <br/> Vault.
                  </h1>
                  <p className="text-white/40 font-medium">Enter your credentials to unlock.</p>
                </div>

                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-6">
                    <InputGroup label="Username" type="text" icon={<User size={18}/>} />
                    <InputGroup label="Password" type="password" icon={<Lock size={18}/>} />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                    <label className="flex items-center gap-2 cursor-pointer text-white/50 hover:text-white transition-colors">
                      <input type="checkbox" className="accent-[#FF6B00] bg-white/10 border-none w-4 h-4 rounded-sm" /> Remember me
                    </label>
                    <a href="#" className="text-[#FF6B00] hover:text-white transition-colors">Recover Keys?</a>
                  </div>

                  <button className="group w-full h-14 bg-[#FF6B00] text-white font-black uppercase italic tracking-wider rounded-xl hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-[0.98] flex items-center justify-center gap-2">
                    <span>Secure Login</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-white/30">
                  New here? 
                  <button onClick={() => setIsLogin(false)} className="ml-2 text-[#FF6B00] font-bold hover:text-white transition-colors uppercase tracking-wide text-xs">Create Vault</button>
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
                <div className="mb-10">
                  <h1 className="text-4xl md:text-5xl font-black italic text-white uppercase mb-2 tracking-tighter">
                    Secure <br/> Monthly.
                  </h1>
                  <p className="text-white/40 font-medium">Create your personal food budget plan.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-6">
                     <InputGroup label="First Name" type="text" />
                     <InputGroup label="Last Name" type="text" />
                  </div>
                  <InputGroup label="Email Address" type="email" icon={<Mail size={18}/>} />
                  <InputGroup label="Create Password" type="password" icon={<Lock size={18}/>} />
                  
                  {/* Agreement Box */}
                  <div className="flex gap-3 items-start p-4 bg-white/5 rounded-lg border border-white/5 hover:border-[#FF6B00]/30 transition-colors">
                    <CheckCircle2 size={16} className="text-[#FF6B00] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-white/50 leading-relaxed font-bold uppercase tracking-wide">
                      I agree to lock my budget. I understand I cannot withdraw cash impulsively, only food.
                    </p>
                  </div>

                  <button className="group w-full h-14 bg-white text-black font-black uppercase italic tracking-wider rounded-xl hover:bg-[#FF6B00] hover:text-white transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                    <span>Create Account</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-white/30">
                  Already secured? 
                  <button onClick={() => setIsLogin(true)} className="ml-2 text-[#FF6B00] font-bold hover:text-white transition-colors uppercase tracking-wide text-xs">Login here</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. RIGHT SIDE - THE VISUAL (Cinematic) */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden items-center justify-center">
        
        {/* Background Image with Heavy Processing */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-50 grayscale contrast-125"
            alt="Ramen Texture" 
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-[#050505]"></div>
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>

        {/* Floating Content */}
        <div className="relative z-10 max-w-lg pl-12 border-l-4 border-[#FF6B00]">
           <h2 className="text-7xl font-black italic text-white uppercase leading-[0.85] tracking-tighter mb-8">
              Eat <br/> Good. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-orange-400">Sleep Well.</span>
           </h2>
           
           <p className="text-lg text-white/70 font-medium leading-relaxed max-w-md">
              The only platform that guarantees your next meal by protecting you from your own spending habits.
           </p>

           <div className="mt-12 flex gap-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                <p className="text-[#FF6B00] font-black text-xl">100%</p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Safe Lock</p>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                <p className="text-[#FF6B00] font-black text-xl">24/7</p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Access</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Premium Input Component
function InputGroup({ label, type, icon }) {
  return (
    <div className="relative group pt-4">
      {/* Icon */}
      {icon && (
        <div className="absolute left-0 bottom-3 text-white/30 group-focus-within:text-[#FF6B00] transition-colors duration-300">
          {icon}
        </div>
      )}

      {/* Input Field (Underline Style) */}
      <input 
        type={type} 
        placeholder=" " // Required for label animation
        required
        className={`
          peer w-full bg-transparent 
          border-b border-white/20 
          text-white font-bold tracking-wide text-lg
          py-2 outline-none
          transition-all duration-300
          focus:border-[#FF6B00]
          ${icon ? 'pl-8' : 'pl-0'}
        `}
      />

      {/* Floating Label */}
      <label className={`
        absolute left-0 pointer-events-none
        text-xs font-bold uppercase tracking-widest text-white/30
        transition-all duration-300
        peer-focus:text-[10px] peer-focus:top-0 peer-focus:text-[#FF6B00]
        peer-placeholder-shown:text-xs peer-placeholder-shown:top-6 peer-placeholder-shown:text-white/30
        ${icon ? 'peer-focus:left-0 peer-placeholder-shown:left-8' : 'peer-focus:left-0 peer-placeholder-shown:left-0'}
        top-0
      `}>
        {label}
      </label>
      
      {/* Animated Bottom Highlight */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF6B00] transition-all duration-500 group-focus-within:w-full"></div>
    </div>
  );
}

export default function IndividualAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]"></div>}>
      <IndividualAuthContent />
    </Suspense>
  );
}