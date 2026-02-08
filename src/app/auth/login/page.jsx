"use client";

import Link from "next/link";
import { User, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#050505] font-sans selection:bg-[#FF6B00] selection:text-white transition-colors duration-500">
      
      {/* 1. LEFT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white dark:bg-[#050505] transition-colors duration-500 border-r border-slate-100 dark:border-white/5">
        
        <Link href="/auth" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-400 hover:text-[#FF6B00] transition-colors font-bold uppercase tracking-widest text-[10px]">
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

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <InputGroup label="Username" type="text" icon={<User size={18}/>} />
              <InputGroup label="Password" type="password" icon={<Lock size={18}/>} />
              
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  <input type="checkbox" className="accent-[#FF6B00]" /> Remember me
                </label>
                <a href="#" className="text-[#FF6B00] hover:underline">Forgot Password?</a>
              </div>

              <button type="submit" className="relative w-full h-11 bg-transparent border-2 border-[#FF6B00] rounded-full text-[#FF6B00] dark:text-white font-bold uppercase tracking-wider overflow-hidden group transition-all hover:text-white active:text-white mt-4">
                <span className="absolute inset-0 w-full h-full bg-[#FF6B00] translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 -z-10"></span>
                <span className="relative z-10">Secure Login</span>
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
    </div>
  );
}

function InputGroup({ type, label, icon }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00] transition-colors">
        {icon}
      </div>
      <input 
        type={type} 
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