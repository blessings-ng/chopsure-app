"use client";

import Link from "next/link";
import { User, Building2, ArrowUpRight, ArrowDownLeft, ArrowLeft } from "lucide-react";

export default function AuthSelectionPage() {
  return (
    <div className="h-screen w-full bg-[#050505] overflow-hidden relative font-sans selection:bg-[#FF6B00] selection:text-white">
      
      {/* BRAND HEADER (Floating Top Left) */}
      <div className="absolute top-6 left-6 z-50 pointer-events-none">
         <span className="text-xl font-black italic tracking-tighter text-white uppercase drop-shadow-md">
            Chop<span className="text-[#FF6B00]">Sure</span>
         </span>
      </div>

      {/* --- NEW BACK BUTTON (Floating Top Right) --- */}
      <Link 
        href="/" 
        className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white hover:bg-[#FF6B00] hover:border-[#FF6B00] transition-all duration-300 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back Home</span>
      </Link>


      {/* =========================================
          SECTION 1: INDIVIDUAL (Top/Left Diagonal)
         ========================================= */}
      <Link 
        href="/auth/login"
        className="group absolute inset-0 w-full h-full z-20 bg-[#050505] hover:z-30 transition-all duration-500
        [clip-path:polygon(0_0,120%_0,-20%_100%)] 
        md:[clip-path:polygon(0_0,100%_0,0_100%)]
        hover:[clip-path:polygon(0_0,130%_0,-30%_100%)] 
        md:hover:[clip-path:polygon(0_0,110%_0,-10%_110%)]"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
            alt="Individual"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#FF6B00]/40 to-transparent mix-blend-multiply"></div>
        </div>

        {/* Content */}
        <div className="absolute top-[18%] left-6 md:top-[20%] md:left-[15%] max-w-xs">
           <div className="mb-4 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FF6B00] flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,107,0,0.5)]">
              <User size={20} className="md:w-6 md:h-6" />
           </div>
           
           <h2 className="text-4xl sm:text-5xl md:text-7xl font-black italic text-white uppercase leading-[0.85] tracking-tighter drop-shadow-lg whitespace-nowrap">
              Individual
           </h2>
           
           <p className="mt-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80 border-l-2 border-[#FF6B00] pl-3">
              Personal Food Vault
           </p>
           
           <div className="mt-6 flex items-center gap-2 text-xs md:text-sm font-black uppercase text-[#FF6B00] bg-white px-4 py-2 rounded-full w-fit group-hover:bg-[#FF6B00] group-hover:text-white transition-colors">
              Enter <ArrowUpRight size={14} className="md:w-4 md:h-4" />
           </div>
        </div>
      </Link>

      {/* =========================================
          SECTION 2: COMPANY (Bottom/Right Diagonal)
         ========================================= */}
      <Link 
        href="/auth/company"
        className="group absolute inset-0 w-full h-full z-10 bg-[#1a1a1a] hover:z-30 transition-all duration-500
        [clip-path:polygon(120%_0,100%_100%,-20%_100%)]
        md:[clip-path:polygon(100%_0,100%_100%,0_100%)]
        hover:[clip-path:polygon(130%_-10%,100%_100%,-30%_100%)]
        md:hover:[clip-path:polygon(110%_-10%,100%_100%,-10%_100%)]"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
            alt="Company"
            className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="absolute bottom-[10%] right-6 md:bottom-[15%] md:right-[15%] text-right max-w-xs flex flex-col items-end">
           <div className="mb-4 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <Building2 size={20} className="md:w-6 md:h-6" />
           </div>
           
           <h2 className="text-4xl sm:text-5xl md:text-7xl font-black italic text-white uppercase leading-[0.85] tracking-tighter drop-shadow-lg whitespace-nowrap">
              Company
           </h2>
           
           <p className="mt-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/60 border-r-2 border-white pl-0 pr-3">
              Corporate Staff Plan
           </p>

           <div className="mt-6 flex items-center gap-2 text-xs md:text-sm font-black uppercase text-black bg-white px-4 py-2 rounded-full w-fit group-hover:bg-slate-200 transition-colors">
              <ArrowDownLeft size={14} className="md:w-4 md:h-4" /> Enter
           </div>
        </div>
      </Link>

      {/* THE SLASH DIVIDER */}
      <div className="absolute inset-0 pointer-events-none z-40">
        <div className="absolute top-0 left-0 w-full h-full bg-transparent border-t-0 border-l-0 border-[#FF6B00] opacity-50 
        [clip-path:polygon(0_0,120%_0,-20%_100%)] md:[clip-path:polygon(0_0,100%_0,0_100%)]"></div>
      </div>

    </div>
  );
}