"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Download, Share2, Loader2, Copy, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const receiptElement = document.getElementById("receipt-export"); 
      
      const canvas = await html2canvas(receiptElement, {
        scale: 4, 
        backgroundColor: null, 
        useCORS: true,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `ChopSure_Receipt_${tx.reference}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to generate receipt:", error);
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
    <div className="min-h-[100dvh] w-full bg-slate-200 dark:bg-[#0a0a0a] flex justify-center items-center px-4">
      <Loader2 size={32} className="animate-spin text-slate-400"/>
    </div>
  );

  if (!tx) return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-slate-200 dark:bg-[#0a0a0a] p-6 text-center">
      <h1 className="text-xl font-black uppercase italic dark:text-white tracking-tighter">Receipt Not Found</h1>
      <Link href="/dashboard" className="mt-6 px-6 py-3 bg-[#FF6B00] text-black font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">
        Return to Dashboard
      </Link>
    </div>
  );

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-slate-200 dark:bg-[#0a0a0a] flex flex-col items-center justify-center py-10 px-4 sm:px-6">
      
      <div className="w-full max-w-[320px] sm:max-w-[380px] flex flex-col">
        
        {/* DASHBOARD LINK */}
        <div className="w-full flex justify-start mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 uppercase font-black text-[10px] sm:text-xs tracking-widest hover:text-[#FF6B00] transition-colors">
            <ArrowLeft size={16}/> Dashboard
          </Link>
        </div>

        {/* THE PAPER RECEIPT */}
        <motion.div 
          id="receipt-export"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full flex flex-col drop-shadow-xl"
        >
          {/* Jagged Top Edge */}
          <svg className="w-full h-2 sm:h-3 text-white dark:text-[#161616]" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="0,100 5,0 10,100 15,0 20,100 25,0 30,100 35,0 40,100 45,0 50,100 55,0 60,100 65,0 70,100 75,0 80,100 85,0 90,100 95,0 100,100" />
          </svg>

          {/* Paper Body */}
          <div className="bg-white dark:bg-[#161616] w-full px-5 sm:px-8 py-6 sm:py-8 font-mono text-slate-900 dark:text-slate-300">
            
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-[10px] sm:text-xs tracking-[0.2em] mb-4 truncate overflow-hidden">*****************************</p>
              <h1 className="text-xl sm:text-2xl font-bold tracking-widest mb-1">RECEIPT</h1>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] mb-4 truncate overflow-hidden">*****************************</p>
              
              <h2 className="text-base sm:text-lg font-bold mt-4">CHOPSURE APP</h2>
              <p className="text-[10px] sm:text-xs mt-1 opacity-70">Lagos, Nigeria</p>
              <p className="text-[10px] sm:text-xs mt-1 opacity-70">
                {new Date(tx.created_at).toLocaleString('en-US', { 
                  month: 'short', day: '2-digit', year: 'numeric', 
                  hour: '2-digit', minute:'2-digit', hour12: false 
                })}
              </p>
              <p className="text-[9px] sm:text-[10px] mt-1 opacity-50 break-all">REF: {tx.reference}</p>
            </div>

            <div className="border-b-2 border-dashed border-slate-300 dark:border-slate-700 w-full mb-6"></div>

            {/* Itemized Section */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between items-start text-xs sm:text-sm gap-4">
                <span className="flex-1 uppercase break-words">1x {tx.description}</span>
                <span className="font-bold whitespace-nowrap">₦{tx.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-b-2 border-dashed border-slate-300 dark:border-slate-700 w-full mb-6"></div>

            {/* Total Section */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-base sm:text-lg font-bold">TOTAL</span>
              <span className="text-lg sm:text-xl font-bold break-all text-right ml-4">₦{tx.amount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-[10px] sm:text-xs opacity-70 mb-2 gap-4">
              <span>Payment Method</span>
              <span className="text-right">Digital Wallet</span>
            </div>
            <div className="flex justify-between items-center text-[10px] sm:text-xs opacity-70 mb-8 gap-4">
              <span>Status</span>
              <span className="text-right">SUCCESSFUL</span>
            </div>

            <div className="border-b-2 border-dashed border-slate-300 dark:border-slate-700 w-full mb-6"></div>

            {/* Footer & Barcode */}
            <div className="text-center flex flex-col items-center">
              <p className="text-xs sm:text-sm font-bold tracking-widest mb-6">THANK YOU</p>
              
              {/* Barcode dynamically scales to fit the width */}
              <div className="w-full flex h-10 sm:h-14 items-center justify-between opacity-80 dark:opacity-50">
                {BARCODE_WIDTHS.map((w, i) => (
                  <div key={i} className={`h-full bg-slate-900 dark:bg-white ${w}`}></div>
                ))}
              </div>
              <p className="text-[8px] sm:text-[9px] tracking-[0.4em] mt-2 opacity-50">{tx.reference.substring(0, 16)}</p>
            </div>

          </div>

          {/* Jagged Bottom Edge */}
          <svg className="w-full h-2 sm:h-3 text-white dark:text-[#161616]" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="0,0 5,100 10,0 15,100 20,0 25,100 30,0 35,100 40,0 45,100 50,0 55,100 60,0 65,100 70,0 75,100 80,0 85,100 90,0 95,100 100,0" />
          </svg>
        </motion.div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pb-6">
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-[#161616] border border-slate-300 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:border-[#FF6B00] hover:text-[#FF6B00] dark:hover:border-[#FF6B00] dark:hover:text-[#FF6B00] transition-all disabled:opacity-50 shadow-sm"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin"/> : <Download size={14}/>} 
            {isDownloading ? 'Saving...' : 'Download'}
          </button>
          
          <button 
            onClick={handleShare}
            className={`flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all ${isCopied ? 'bg-[#10B981] shadow-emerald-500/20' : 'bg-[#FF6B00] shadow-orange-500/20 hover:scale-[1.02]'}`}
          >
            {isCopied ? <Check size={14}/> : (navigator.share ? <Share2 size={14}/> : <Copy size={14}/>)}
            {isCopied ? 'Copied!' : 'Share'}
          </button>
        </div>

      </div>
    </div>
  );
}