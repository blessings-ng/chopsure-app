"use client";

import Link from "next/link";
import { ArrowLeft, Instagram, TikTok, Linkedin, Mail } from "lucide-react"; // Note: TikTok icon is often from standard sets or custom

export default function ContactPage() {
  return (
    <div className="h-screen w-full bg-[#0A0A0A] text-white flex flex-col overflow-hidden">
      {/* Navigation */}
      <div className="px-6 py-6 border-b border-white/5">
        <Link href="/settings" className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-[#FF6B00]">
          <ArrowLeft size={10}/> BACK
        </Link>
      </div>

      {/* Viewport-Locked Grid - 12 Columns for zero-space precision */}
      <div className="flex-1 grid grid-cols-12 gap-0">
        
        {/* LEFT: VISUAL (Artisanal Food) */}
        <div className="col-span-12 lg:col-span-6 relative overflow-hidden bg-[#1A1A1A]">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200" 
            alt="Artisanal food preparation" 
            className="w-full h-full object-cover opacity-70"
          />
          
        </div>

        {/* RIGHT: DATA & FORM (Dense, zero-waste layout) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center px-12 py-6 bg-black">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-6">GET IN TOUCH</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border-l border-[#FF6B00] pl-4">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Open Daily</p>
              <p className="text-[10px] font-bold tracking-widest uppercase">08:00 - 22:00</p>
            </div>
            <div className="border-l border-[#FF6B00] pl-4">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Response</p>
              <p className="text-[10px] font-bold tracking-widest uppercase">15 Min</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="FULL NAME" className="w-full bg-transparent border-b border-white/10 py-2 text-[10px] uppercase tracking-widest outline-none focus:border-[#FF6B00]" />
            <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-transparent border-b border-white/10 py-2 text-[10px] uppercase tracking-widest outline-none focus:border-[#FF6B00]" />
            <textarea rows="2" placeholder="HOW CAN WE ASSIST?" className="w-full bg-transparent border-b border-white/10 py-2 text-[10px] uppercase tracking-widest outline-none focus:border-[#FF6B00] resize-none" />
            <button className="w-full py-3 bg-[#FF6B00] text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors">
              SEND MESSAGE
            </button>
          </form>

          <div className="mt-6 flex gap-6">
            <Link href="#" className="text-slate-500 hover:text-[#FF6B00]"><Instagram size={14} /></Link>
            <Link href="#" className="text-slate-500 hover:text-[#FF6B00] font-black text-[10px]"><Mail size={14} /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}