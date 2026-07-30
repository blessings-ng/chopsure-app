"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Download, Share2, Loader2, Copy, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";

const BARCODE_WIDTHS = ['w-1', 'w-2', 'w-0.5', 'w-1.5', 'w-1', 'w-3', 'w-0.5', 'w-2', 'w-1', 'w-1', 'w-0.5', 'w-2', 'w-1', 'w-1.5', 'w-2', 'w-0.5', 'w-1', 'w-2', 'w-1', 'w-1.5', 'w-0.5', 'w-3', 'w-1', 'w-0.5', 'w-2', 'w-1', 'w-1.5', 'w-0.5', 'w-1'];

export default function ReceiptPage() {
  const { id } = useParams();
  const supabase = createClient();
  const router = useRouter();
  
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!id) return; 

    async function fetchReceipt() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("reference", id)
        .maybeSingle();

      if (error || !data) {
        console.error("Receipt error:", error);
      } else {
        setTx(data);
      }
      setLoading(false);
    }
    fetchReceipt();
  }, [id, supabase]);

  // REPLACED: Uses modern html-to-image to bypass CSS lab() parsing errors
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const receiptElement = document.getElementById("receipt-export"); 
      
      const dataUrl = await toPng(receiptElement, {
        quality: 1,
        pixelRatio: 3, // Multiplies resolution for a crystal clear image
        skipFonts: true, // Prevents custom font loading timeouts
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `ChopSure_Receipt_${tx.reference}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to generate receipt:", error);
      alert("Error generating receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ChopSure Receipt',
          text: `Payment Receipt for ₦${tx.amount.toLocaleString()} - Ref: ${tx.reference}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('User cancelled share');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (loading) return (
    <div className="min-h-[100dvh] w-full bg-slate-100 dark:bg-[#0a0a0a] flex justify-center items-center">
      <Loader2 size={32} className="animate-spin text-[#FF6B00]"/>
    </div>
  );

  if (!tx) return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-slate-100 dark:bg-[#0a0a0a] p-6 text-center">
      <h1 className="text-xl font-black uppercase italic dark:text-white tracking-tighter">Receipt Not Found</h1>
      <Link href="/dashboard" className="mt-6 px-6 py-3 bg-[#FF6B00] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl">
        Return to Dashboard
      </Link>
    </div>
  );

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-slate-100 dark:bg-[#0a0a0a] flex flex-col items-center pt-6 sm:pt-12 pb-10 px-0 sm:px-6">
      
      <div className="w-full max-w-2xl flex flex-col px-2 sm:px-0">
        
        <div className="w-full flex justify-start mb-4 sm:mb-6 pl-2 sm:pl-0">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 uppercase font-black text-[10px] sm:text-xs tracking-widest hover:text-[#FF6B00] transition-colors">
            <ArrowLeft size={16}/> Dashboard
          </Link>
        </div>

        <motion.div 
          id="receipt-export"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full flex flex-col drop-shadow-2xl"
        >
          <svg className="w-full h-3 text-white dark:text-[#161616]" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="0,100 5,0 10,100 15,0 20,100 25,0 30,100 35,0 40,100 45,0 50,100 55,0 60,100 65,0 70,100 75,0 80,100 85,0 90,100 95,0 100,100" />
          </svg>

          <div className="bg-white dark:bg-[#161616] w-full px-4 sm:px-10 py-8 md:py-10 font-mono text-slate-900 dark:text-slate-300">
            
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-[10px] sm:text-xs tracking-[0.2em] mb-4 truncate overflow-hidden opacity-50">****************************************</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest mb-1">SUCCESSFUL</h1>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] mb-6 truncate overflow-hidden opacity-50">****************************************</p>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-5">CHOPSURE APP</h2>
              <p className="text-xs sm:text-sm mt-2 opacity-70">Lagos, Nigeria</p>
              <p className="text-xs sm:text-sm mt-1 opacity-70">
                {new Date(tx.created_at).toLocaleString('en-US', { 
                  month: 'short', day: '2-digit', year: 'numeric', 
                  hour: '2-digit', minute:'2-digit', hour12: false 
                })}
              </p>
              <p className="text-[10px] sm:text-xs mt-3 opacity-50 break-all uppercase tracking-wider">REF: {tx.reference}</p>
            </div>

            <div className="border-b-2 border-dashed border-slate-300 dark:border-slate-700 w-full mb-8"></div>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex justify-between items-start text-base sm:text-lg gap-4">
                <span className="flex-1 uppercase break-words leading-snug">1x {tx.description}</span>
                <span className="font-bold whitespace-nowrap">₦{tx.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-b-2 border-dashed border-slate-300 dark:border-slate-700 w-full mb-8"></div>

            <div className="flex justify-between items-center mb-10">
              <span className="text-xl sm:text-2xl font-bold">TOTAL</span>
              <span className="text-3xl sm:text-4xl font-bold break-all text-right ml-4 ">₦{tx.amount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm opacity-70 mb-4 gap-4">
              <span>Payment Method</span>
              <span className="text-right uppercase font-bold">Digital Wallet</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm opacity-70 mb-10 gap-4">
              <span>Status</span>
              <span className="text-right uppercase font-bold text-[#10B981]">SUCCESSFUL</span>
            </div>

            <div className="border-b-2 border-dashed border-slate-300 dark:border-slate-700 w-full mb-10"></div>

            <div className="text-center flex flex-col items-center">
              <p className="text-sm sm:text-base font-bold tracking-widest mb-8">THANK YOU</p>
              
              <div className="w-full flex h-16 sm:h-20 items-center justify-between opacity-80 dark:opacity-50">
                {BARCODE_WIDTHS.map((w, i) => (
                  <div key={i} className={`h-full bg-slate-900 dark:bg-white ${w}`}></div>
                ))}
                <div className="hidden sm:flex h-full w-full justify-between ml-1">
                  {BARCODE_WIDTHS.slice(0, 15).map((w, i) => (
                    <div key={`extra-${i}`} className={`h-full bg-slate-900 dark:bg-white ${w}`}></div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] sm:text-xs tracking-[0.4em] mt-4 opacity-50 uppercase">{tx.reference.substring(0, 16)}</p>
            </div>

          </div>

          <svg className="w-full h-3 text-white dark:text-[#161616]" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="0,0 5,100 10,0 15,100 20,0 25,100 30,0 35,100 40,0 45,100 50,0 55,100 60,0 65,100 70,0 75,100 80,0 85,100 90,0 95,100 100,0" />
          </svg>
        </motion.div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-10 pb-10">
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="flex items-center justify-center gap-3 py-4 sm:py-5 rounded-xl bg-white dark:bg-[#161616] border border-slate-200 dark:border-white/10 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white hover:border-[#FF6B00] hover:text-[#FF6B00] dark:hover:border-[#FF6B00] dark:hover:text-[#FF6B00] transition-all disabled:opacity-50 shadow-sm"
          >
            {isDownloading ? <Loader2 size={18} className="animate-spin"/> : <Download size={18}/>} 
            {isDownloading ? 'Saving Image...' : 'Download Receipt'}
          </button>
          
          <button 
            onClick={handleShare}
            className={`flex items-center justify-center gap-3 py-4 sm:py-5 rounded-xl text-xs font-black uppercase tracking-widest text-black transition-all ${isCopied ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-500/20' : 'bg-[#FF6B00] shadow-lg shadow-orange-500/20 hover:scale-[1.02]'}`}
          >
            {isCopied ? <Check size={18}/> : (navigator.share ? <Share2 size={18}/> : <Copy size={18}/>)}
            {isCopied ? 'Copied to Clipboard!' : 'Share Receipt'}
          </button>
        </div>

      </div>
    </div>
  );
}