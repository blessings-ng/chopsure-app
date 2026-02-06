"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Mail, Phone, Chrome } from "lucide-react";

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [usePhone, setUsePhone] = useState(false);

  // Exact staggered logic from your CSS snippet
  const staggered = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.1, // calc(.1s * var(--li))
        duration: 0.7, // .7s ease
        ease: "easeInOut"
      }
    })
  };

  const handleAuth = (e) => {
    e.preventDefault();
    // Logic for Supabase/Firebase goes here
    console.log("Form Submitted");
  };

  return (
    <div className="relative w-full h-[650px] bg-[#1a1c24] rounded-[2.5rem] overflow-hidden flex border border-white/5 shadow-2xl">
      
      {/* 1. THE RADIAL SEMI-CIRCLE ROLL (Down-to-Up) */}
      <motion.div
        initial={false}
        animate={{ 
          clipPath: isSignup 
            ? "circle(150% at 50% 100%)" // Expansion center at bottom
            : "circle(40% at 100% 100%)", // Slanted resting state
        }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        className="absolute inset-0 bg-[#FF6B00] z-50 flex flex-col items-center justify-center p-12 text-white text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignup ? "welcome" : "hello"}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="space-y-6"
          >
            <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
              {isSignup ? "Welcome\nBack!" : "Hello,\nFriend!"}
            </h1>
            <p className="text-orange-100 font-medium max-w-[280px] mx-auto text-sm">
              {isSignup 
                ? "Enter your credentials to stay connected with the fleet." 
                : "Register today and join the infrastructure securing workforce nutrition."}
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsSignup(!isSignup)}
              className="rounded-full border-2 border-white px-12 h-14 font-black hover:bg-white hover:text-[#FF6B00] transition-all uppercase text-[10px] tracking-widest"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </Button>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* 2. THE STATIONARY FORMS */}
      <div className="relative flex w-full h-full">
        
        {/* --- LOGIN SIDE --- */}
        <div className="w-1/2 flex flex-col items-center justify-center p-12 z-10">
          <div className={`w-full max-w-sm space-y-8 transition-all duration-500 ${isSignup ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
            <motion.h2 custom={1} variants={staggered} animate={!isSignup ? "visible" : "hidden"} className="text-5xl font-black text-white italic tracking-tighter">Login</motion.h2>
            
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-4">
                <motion.div custom={2} variants={staggered} animate={!isSignup ? "visible" : "hidden"} className="relative border-b border-slate-700">
                  <Input required placeholder="Username or Email" className="h-12 border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white" />
                  <Mail className="absolute right-0 bottom-3 text-slate-500" size={18} />
                </motion.div>
                <motion.div custom={3} variants={staggered} animate={!isSignup ? "visible" : "hidden"} className="relative border-b border-slate-700">
                  <Input required type="password" placeholder="Password" className="h-12 border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white" />
                  <Lock className="absolute right-0 bottom-3 text-slate-500" size={18} />
                </motion.div>
              </div>

              <motion.div custom={4} variants={staggered} animate={!isSignup ? "visible" : "hidden"} className="space-y-4">
                <Button type="submit" className="w-full h-14 rounded-full font-black text-lg bg-[#FF6B00] shadow-xl shadow-orange-500/20 uppercase italic text-white">Sign In</Button>
                <div className="relative flex items-center py-2"><div className="flex-grow border-t border-slate-800"></div><span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">OR</span><div className="flex-grow border-t border-slate-800"></div></div>
                <Button type="button" variant="outline" className="w-full h-14 rounded-full border-slate-700 text-white font-bold hover:bg-slate-800"><Chrome className="mr-2" size={20} /> Continue with Google</Button>
              </motion.div>
            </form>
          </div>
        </div>

        {/* --- REGISTER SIDE --- */}
        <div className="w-1/2 flex flex-col items-center justify-center p-12 z-10">
          <div className={`w-full max-w-sm space-y-6 transition-all duration-500 ${!isSignup ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
            <motion.h2 custom={1} variants={staggered} animate={isSignup ? "visible" : "hidden"} className="text-5xl font-black text-white italic tracking-tighter">Register</motion.h2>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <motion.div custom={2} variants={staggered} animate={isSignup ? "visible" : "hidden"} className="relative border-b border-slate-700">
                <Input required placeholder="Full Name" className="h-12 border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white" />
                <User className="absolute right-0 bottom-3 text-slate-500" size={18} />
              </motion.div>

              <motion.div custom={3} variants={staggered} animate={isSignup ? "visible" : "hidden"} className="relative border-b border-slate-700">
                <Input required type={usePhone ? "tel" : "email"} placeholder={usePhone ? "Phone Number" : "Work Email"} className="h-12 border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white" />
                <button type="button" onClick={() => setUsePhone(!usePhone)} className="absolute right-0 bottom-3 text-primary hover:text-white transition-colors">
                  {usePhone ? <Mail size={18} /> : <Phone size={18} />}
                </button>
              </motion.div>

              <motion.div custom={4} variants={staggered} animate={isSignup ? "visible" : "hidden"} className="relative border-b border-slate-700">
                <Input required type="password" placeholder="Create Password" className="h-12 border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-white" />
              </motion.div>

              <motion.div custom={5} variants={staggered} animate={isSignup ? "visible" : "hidden"} className="space-y-4 pt-4">
                <Button type="submit" className="w-full h-14 rounded-full font-black text-lg bg-[#FF6B00] shadow-xl shadow-orange-500/20 uppercase italic text-white">Create Account</Button>
                <Button type="button" variant="outline" className="w-full h-14 rounded-full border-slate-700 text-white font-bold hover:bg-slate-800"><Chrome className="mr-2" size={20} /> Register with Google</Button>
              </motion.div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}