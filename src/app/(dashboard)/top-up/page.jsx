"use client";

import dynamic from 'next/dynamic';

// Disable SSR to prevent the "window is not defined" error from Paystack
const TopUpForm = dynamic(() => import('@/components/dashboard/TopUpForm'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#050505]">
      <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
        Syncing Tactical Links...
      </p>
    </div>
  )
});

export default function TopUpPage() {
  return <TopUpForm />;
}