"use client";

import Link from "next/link";
import { ArrowLeft, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function CompanyComingSoon() {
  const [email, setEmail] = useState("");
  const [isNotified, setIsNotified] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setIsNotified(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center relative p-6 font-sans selection:bg-[#FF6B00] selection:text-white">
      
      {/* 1. BACK LINK (Top Left) */}
      <Link 
        href="/auth" 
        className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-[#FF6B00] transition-colors font-bold uppercase tracking-widest text-[10px] group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Selection
      </Link>

      {/* 2. BACKGROUND VISUAL (Subtle) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Faint Noise Texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        {/* Subtle Glow in Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]"></div>
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="relative z-10 max-w-lg w-full text-center">
        
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5">
          <Building2 size={32} />
        </div>

        {/* Text */}
        <h1 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter mb-4">
          Coming <span className="text-white/20">Soon</span>
        </h1>
        
        <p className="text-white/50 font-medium text-sm md:text-base leading-relaxed mb-10 max-w-sm mx-auto">
          We are building the ultimate <strong>Corporate Food Vault</strong>. Automate staff welfare and eliminate logistics.
        </p>

        {/* 4. SIMPLE NOTIFY FORM */}
        {!isNotified ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto">
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter official email"
                className="w-full h-12 bg-transparent border-b border-white/20 text-white font-bold text-center placeholder:text-white/20 outline-none focus:border-[#FF6B00] transition-colors pb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="w-full h-12 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-[#FF6B00] hover:text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
              Notify Me <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          /* Success State */
          <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <CheckCircle2 size={48} className="text-[#FF6B00] mb-2" />
             <h3 className="text-white font-bold text-lg">You're on the list!</h3>
             <p className="text-white/40 text-xs uppercase tracking-widest">We'll touch base soon.</p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-white/5">
           <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
             ChopSure Enterprise &bull; Launching Q3 2026
           </p>
        </div>

      </div>
    </div>
  );
}