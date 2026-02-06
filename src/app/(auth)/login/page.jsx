"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Mail } from "lucide-react";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);

  // Exact logic from your snippet: .7s ease, filter: blur(10px), translateX(120%)
  const staggeredEntrance = {
    hidden: (dir) => ({ 
      opacity: 0, 
      x: dir === "in" ? 120 : -120, // transform: translateX(120%)
      filter: "blur(10px)",         // filter: blur(10px)
      scale: 0.9
    }),
    visible: (i) => ({
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        delay: i * 0.1,             // transition-delay: calc(.1s * var(--li))
        duration: 0.7,              // transition: .7s ease
        ease: "easeInOut" 
      }
    })
  };

  return (
    <div className="relative w-full max-w-[1050px] h-[650px] bg-[#1a1c24] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex border border-white/5">
      
      {/* 1. THE RADIAL SEMI-CIRCLE OVERLAY (Orange Curtain) */}
      {/* This panel "draws" itself from down to up in a circular arc */}
      <motion.div
        initial={false}
        animate={{ 
          // The "Roll": Moves the panel to the lesser part while swapping angles
          x: isSignup ? "-100%" : "0%",
          left: isSignup ? "40%" : "60%",
          // The Circle Sweep: Expands from bottom-center upward in a curve
          clipPath: isSignup 
            ? "circle(150% at 100% 100%)" // Sweeps upward from bottom-right
            : "circle(150% at 0% 100%)",  // Sweeps upward from bottom-left
        }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        className="absolute top-0 w-[40%] h-full bg-[#FF6B00] z-50 hidden lg:flex flex-col items-center justify-center p-12 text-white text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignup ? "welcome" : "hello"}
            initial={{ opacity: 0, rotate: isSignup ? 10 : -10, y: 40 }}
            animate={{ opacity: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, rotate: isSignup ? -10 : 10, y: -40 }}
            className="space-y-8"
          >
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
              {isSignup ? "Welcome\nBack!" : "Hello,\nFriend!"}
            </h1>
            <p className="text-orange-100 font-medium max-w-[240px] mx-auto text-sm leading-relaxed">
              {isSignup 
                ? "We are happy to have you with us again. Ready for lunch?"
                : "Join the infrastructure securing workforce nutrition in Nigeria."}
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsSignup(!isSignup)}
              className="rounded-full border-2 border-white px-12 h-14 font-black hover:bg-white hover:text-[#FF6B00] transition-all uppercase text-xs tracking-widest"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </Button>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* 2. FORMS CONTAINER (Asymmetric balance) */}
      <div className="relative flex w-full h-full">
        
        {/* --- LOGIN FORM SIDE (60% Width) --- */}
        <div className={`w-full lg:w-[60%] flex flex-col items-center justify-center p-12 transition-all duration-700 ${isSignup ? "opacity-0 pointer-events-none translate-x-12" : "opacity-100 translate-x-0"}`}>
          <div className="w-full max-w-sm space-y-12">
            <motion.h2 custom={1} variants={staggeredEntrance} animate={!isSignup ? "visible" : "hidden"} className="text-7xl font-black text-white tracking-tighter italic">Login</motion.h2>
            <form className="space-y-8">
              <motion.div custom={2} variants={staggeredEntrance} animate={!isSignup ? "visible" : "hidden"} className="relative group border-b border-slate-700">
                <Input placeholder="Username" className="h-14 border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#FF6B00] text-white text-xl font-bold" />
                <User className="absolute right-0 bottom-4 text-slate-500" size={20} />
              </motion.div>
              <motion.div custom={3} variants={staggeredEntrance} animate={!isSignup ? "visible" : "hidden"} className="relative group border-b border-slate-700">
                <Input type="password" placeholder="Password" className="h-14 border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#FF6B00] text-white text-xl font-bold" />
                <Lock className="absolute right-0 bottom-4 text-slate-500" size={20} />
              </motion.div>
              <motion.div custom={4} variants={staggeredEntrance} animate={!isSignup ? "visible" : "hidden"}>
                 <Button className="w-48 h-16 rounded-full font-black text-xl bg-[#FF6B00] shadow-2xl shadow-orange-500/20 uppercase tracking-tighter italic text-white">Login</Button>
              </motion.div>
            </form>
          </div>
        </div>

        {/* --- REGISTER FORM SIDE (60% Width) --- */}
        <div className={`absolute right-0 w-full lg:w-[60%] h-full flex flex-col items-center justify-center p-12 transition-all duration-700 ${!isSignup ? "opacity-0 pointer-events-none -translate-x-12" : "opacity-100 translate-x-0"}`}>
          <div className="w-full max-w-sm space-y-10">
            <motion.h2 custom={1} variants={staggeredEntrance} animate={isSignup ? "visible" : "hidden"} className="text-7xl font-black text-white tracking-tighter italic">Register</motion.h2>
            <form className="space-y-5">
              {["Username", "Email", "Password"].map((label, i) => (
                <motion.div key={label} custom={i + 2} variants={staggeredEntrance} animate={isSignup ? "visible" : "hidden"} className="relative border-b border-slate-700">
                  <Input placeholder={label} className="h-14 border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#FF6B00] text-white text-lg font-bold" />
                </motion.div>
              ))}
              <motion.div custom={5} variants={staggeredEntrance} animate={isSignup ? "visible" : "hidden"} className="pt-6">
                <Button className="w-48 h-16 rounded-full font-black text-xl bg-[#FF6B00] shadow-2xl shadow-orange-500/20 uppercase tracking-tighter italic text-white">Register</Button>
              </motion.div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}