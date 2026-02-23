"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Utensils, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function WelcomePage() {
  const router = useRouter();
  const supabase = createClient();
  const [firstName, setFirstName] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      // Use getSession for immediate hydration check
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Fallback to getUser for security verification
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }
        setFirstName(user.user_metadata?.first_name || "Foodie");
      } else {
        setFirstName(session.user.user_metadata?.first_name || "Foodie");
      }

      // Cinematic "loading" process
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 2500);

      return () => clearTimeout(timer);
    };

    fetchUser();
  }, [router, supabase]);

  // Framer Motion Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#FF6B00] selection:text-white px-6">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B00]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-lg text-center flex flex-col items-center"
      >
        <motion.div variants={itemVars} className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,107,0,0.1)]">
          <Utensils size={32} className="text-[#FF6B00]" />
        </motion.div>

        <motion.h1 variants={itemVars} className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-4">
          Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-orange-400">{firstName}.</span>
        </motion.h1>

        <motion.p variants={itemVars} className="text-slate-400 font-medium mb-12 max-w-sm">
          Your account is verified. We are setting up your personal food vault and locking in your preferences.
        </motion.p>

        {/* Cinematic Initialization Steps */}
        <div className="w-full max-w-xs space-y-4 mb-12 text-left">
          <LoadingStep text="Encrypting Vault Details" delay={0.5} />
          <LoadingStep text="Securing Budget Parameters" delay={1.2} />
          <LoadingStep text="Generating Virtual ID" delay={1.8} />
        </div>

        {/* Enter Dashboard Button (Appears when ready) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isReady ? 1 : 0, scale: isReady ? 1 : 0.9 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xs"
        >
          <button 
            onClick={() => router.push("/dashboard")}
            disabled={!isReady}
            className={`w-full h-14 rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 ${
              isReady 
                ? "bg-[#FF6B00] text-black hover:bg-orange-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] cursor-pointer" 
                : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
            }`}
          >
            Enter Your Vault <ArrowRight size={18} />
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}

function LoadingStep({ text, delay }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500 ${done ? 'bg-[#10B981]' : 'bg-white/10 animate-pulse'}`}>
        {done && <CheckCircle2 size={12} className="text-black" />}
      </div>
      <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-500 ${done ? 'text-white' : 'text-slate-500'}`}>
        {text}
      </span>
    </div>
  );
}