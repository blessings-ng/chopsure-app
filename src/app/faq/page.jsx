"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Plus, Minus } from "lucide-react";
import Link from "next/link";

const faqData = [
  { q: "How does the daily allocation system work?", a: "Your daily allocation is a pre-set limit designed to keep your mart operations running smoothly. It resets every 24 hours at midnight. This ensures you always have a predictable amount of capital ready for market opportunities without needing to manually request funds every time." },
  { q: "What is a 'Raw Mart' window?", a: "A Raw Mart window is a specific timeframe where we provide exclusive access to market spreads. These are high-value moments where the difference between buying and selling is at its lowest. We alert you via push notifications the second these windows open so you never miss a profitable moment." },
  { q: "How do we keep your funds secure?", a: "Security is the core of our business. We use end-to-end encryption for every transaction and keep user funds in isolated accounts, completely separate from our operational budget. We also run 24/7 automated security audits to detect and block any suspicious activity instantly." },
  { q: "What happens if a transaction is slow?", a: "Because we prioritize speed, most transactions finish in under 3 seconds. If a transaction stays 'pending' longer than that, our automated system starts a background check immediately. You don't have to do anything—we handle the reconciliation and will alert you as soon as the status changes." }
];

const Accordion = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-8 flex items-center justify-between text-left hover:text-[#FF6B00] transition-colors">
        <span className="text-sm font-bold uppercase tracking-wide pr-4">{q}</span>
        {isOpen ? <Minus size={18} className="shrink-0" /> : <Plus size={18} className="shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <p className="pb-8 text-xs text-slate-400 leading-relaxed max-w-2xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white w-full">
      <div className="w-full max-w-[1400px] mx-auto px-6 py-12">
        <Link href="/settings" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white mb-16 transition-colors">
          <ArrowLeft size={16}/> Back to Account Settings
        </Link>
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9]">Smart <br/>Capital.</h1>
            <div className="space-y-6 text-sm text-slate-300 leading-relaxed max-w-lg">
              <p>We are a fintech infrastructure company built for the new digital economy. We don't believe in traditional, slow-moving banking. We believe in velocity.</p>
              <p>Our platform was engineered to give you direct access to market windows and liquidity allocations that were once reserved for institutional traders. By removing the middleman and automating the reconciliation process, we make high-level trading accessible to everyday customers.</p>
              <p>Your money shouldn't just sit in a static account. It should be moving, working, and growing. We provide the high-performance tools you need to make that happen safely.</p>
            </div>
          </div>
          <div className="w-full h-[400px] lg:h-[600px] bg-slate-900 rounded-2xl overflow-hidden border border-white/10">
             <img src="https://images.unsplash.com/photo-1640198776965-fd831c4f80e7?auto=format&fit=crop&q=80&w=1200" alt="Tech Infrastructure" className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="max-w-4xl">
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] mb-4 text-[#FF6B00]">Answers to your questions</h2>
          <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-12">How it works</h3>
          {faqData.map((item, i) => <Accordion key={i} q={item.q} a={item.a} />)}
        </div>
      </div>
    </div>
  );
}