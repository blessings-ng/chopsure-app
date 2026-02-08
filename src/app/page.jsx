"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle"; 
import { 
  ShieldCheck, Utensils, ShoppingBasket, MoveDown, Check, Truck, ChefHat, 
  X,
} from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("personal");
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { scrollYProgress } = useScroll();
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "50%"]);

  useEffect(() => setMounted(true), []);

  const slides = [
    { image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80", title: "RESTAURANT" },
    { image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80", title: "GROCERY" },
    { image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80", title: "CHEF" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-[#10B981] selection:text-white font-sans transition-colors duration-300">
      
      {/* 1. FIXED BACKGROUND SLIDESHOW */}
      <div className="fixed inset-0 -z-10 w-full h-full bg-grey-900">
        {slides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
            <img 
              src={slide.image} 
              className="w-full h-full object-cover opacity-60 dark:opacity-40 scale-105 animate-slow-pan" 
              alt={slide.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/40 to-slate-50/10 dark:from-[#050505] dark:via-[#050505]/60 dark:to-black/40" />
          </div>
        ))}
      </div>

      {/* 2. NAV */}
      <nav className="fixed top-0 w-full z-50 h-24 flex items-center justify-between px-6 lg:px-20 border-b border-black/5 dark:border-white/5 backdrop-blur-md bg-white/10 dark:bg-black/20">
        <span className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase group cursor-pointer">
          ChopSure
        </span>
        
        <div className="flex items-center gap-4 md:gap-6">
          {/* THEME TOGGLE */}
          <ThemeToggle />

          <div className="hidden md:block">
            {/* LINK TO LOGIN MODE */}
            <Link 
              href="/auth?mode=login" 
              className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-xs hover:text-[#10B981] transition-colors"
            >
              Login
            </Link>
          </div>

          {/* LINK TO SIGNUP MODE */}
          <Link 
            href="/auth?mode=signup" 
            className="bg-[#FF6B00] text-white font-black px-6 md:px-8 py-3 rounded-none skew-x-[-10deg] uppercase italic tracking-tighter hover:bg-[#10B981] hover:skew-x-[0deg] transition-all shadow-lg shadow-orange-500/20 text-sm md:text-base"
          >
            Get Access
          </Link>
        </div>
      </nav>

      <main>
        
        {/* 3. HERO SECTION */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 pt-32 pb-20">
          <motion.div style={{ y: textY }} className="z-10 space-y-6 md:space-y-8 max-w-5xl">
            
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 border border-[#10B981] bg-[#10B981]/10 text-[#10B981] dark:text-[#10B981] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] backdrop-blur-md">
              <ShieldCheck size={14} strokeWidth={4} /> Never Go Hungry
            </div>
            
            <h1 className="text-[14vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter uppercase italic drop-shadow-sm">
              <span className="text-slate-900 dark:text-white transition-colors">SECURE YOUR</span> <br /> 
              <span className="text-[#FF6B00]">FOOD BUDGET.</span>
            </h1>

            <p className="text-lg md:text-3xl text-slate-700 dark:text-slate-200 max-w-3xl mx-auto font-black uppercase leading-tight italic">
              "You provide the budget. <br className="hidden md:block"/> <span className="text-[#10B981] underline decoration-[#10B981]">We guarantee everyday food.</span>"
            </p>
            
            <p className="text-sm md:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto px-4">
              Your first HMO for food. Lock your monthly allowance. Redeem guaranteed meals at partner restaurants daily.
            </p>

            <div className="pt-8 flex flex-wrap justify-center gap-6">
              {/* HERO CTA LINK */}
              <Link 
                href="/auth?mode=signup" 
                className="inline-flex items-center justify-center h-14 md:h-16 px-10 md:px-12 bg-[#FF6B00] text-white font-black uppercase italic tracking-tighter hover:bg-[#10B981] hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,107,0,0.3)] text-sm md:text-base rounded-lg"
              >
                Secure My Month
              </Link>
            </div>
          </motion.div>
          
          <div className="absolute bottom-10 animate-bounce text-slate-900 dark:text-white/50">
            <MoveDown size={24} className="md:w-8 md:h-8" />
          </div>
        </section>

        {/* 4. PARTNER MARQUEE */}
        <div className="py-4 md:py-4 bg-[#FF6B00] overflow-hidden -rotate-2 scale-135 border-y-5 border-black dark:border-black relative z-20 shadow-xl">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="text-2xl md:text-4xl font-black italic text-black uppercase tracking-tighter flex items-center gap-4">
                  Dominos <span className="text-white">★</span> item7 <span className="text-white">★</span> Chicken republic <span className="text-white">★</span> JazzyBurger <span className="text-white">★</span>
              </span>
            ))}
          </div>
        </div>

        {/* 5. COMPARISON SECTION */}
        <section className="py-20 md:py-32 px-6 bg-white dark:bg-[#050505] transition-colors duration-300 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:space-y-8">
              <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                SALARY WEEK <br /> TO <br /> <span className="text-[#10B981] underline decoration-4 underline-offset-4">Next salary week</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                We are your <strong>Financial discipline</strong>. While others spend on impulse, you lock your food money in a secure vault, ensuring you eat everyday of the month.
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-[#151515] p-8 md:p-10 border border-slate-200 dark:border-white/10 relative shadow-2xl rounded-3xl hover:scale-[1.02] transition-transform duration-500 hover:shadow-[#10B981]/20">
               <ul className="space-y-6">
                 <li className="flex items-center gap-4 text-slate-500 font-bold uppercase tracking-wider line-through decoration-red-500 decoration-2"><X className="text-red-500"/> Cash gets spent on data</li>
                 <li className="flex items-center gap-4 text-slate-500 font-bold uppercase tracking-wider line-through decoration-red-500 decoration-2"><X className="text-red-500"/> Cash gets borrowed</li>
                 <li className="flex items-center gap-4 text-slate-900 dark:text-white font-black text-2xl uppercase tracking-wider"><Check className="text-[#10B981]" strokeWidth={4}/> Cash must be spent on food</li>
               </ul>
            </div>
          </div>
        </section>

        {/* 6. LIFESTYLE SECTION */}
        <section className="py-20 md:py-32 px-6 bg-slate-50 dark:bg-[#0A0A0A] transition-colors duration-300 relative z-10">
          <div className="max-w-7xl mx-auto space-y-16 md:space-y-20">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
                YOUR BELLY <br /> <span className="text-[#FF6B00]">SECURED</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">Select your consumption mode</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* COOKED MODE */}
              <div className="group relative h-[500px] md:h-[600px] border-4 border-[#FF6B00] bg-white dark:bg-[#111] overflow-hidden rounded-[2rem] hover:shadow-2xl hover:shadow-[#FF6B00]/40 transition-all duration-500 cursor-default">
                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80" className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-60 group-hover:scale-110 transition-transform duration-700 ease-out" alt=""/>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8 md:p-10 flex flex-col justify-end">
                  <ChefHat className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-[#FF6B00] mb-6 group-hover:rotate-[30deg] transition-transform duration-500" />
                  <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase leading-none mb-4">COOKED FOOD <br/> FREEDOM.</h3>
                  <p className="text-slate-200 font-medium text-base md:text-lg">
                    Walk into any partner restaurant and eat. Or get your hot meal delivered to your office desk.
                  </p>
                  <div className="mt-8 flex gap-3">
                    <span className="px-4 py-2 bg-white/20 text-white text-[10px] md:text-xs font-black uppercase backdrop-blur-md border border-white/20">Dine-in</span>
                    <span className="px-4 py-2 bg-[#FF6B00] text-white text-[10px] md:text-xs font-black uppercase">Fast Delivery</span>
                  </div>
                </div>
              </div>

              {/* RAW MODE */}
              <div className="group relative h-[500px] md:h-[600px] border-4 border-[#10B981] bg-white dark:bg-[#111] overflow-hidden rounded-[2rem] hover:shadow-2xl hover:shadow-[#10B981]/40 transition-all duration-500 cursor-default">
                <div className="absolute top-6 right-6 bg-[#10B981] text-black text-[10px] md:text-xs font-black px-4 py-2 uppercase z-10 animate-pulse">Window: 10th-14th</div>
                <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80" className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-60 group-hover:scale-110 transition-transform duration-700 ease-out" alt=""/>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8 md:p-10 flex flex-col justify-end">
                  <Truck className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-[#10B981] mb-6 group-hover:translate-x-6 transition-transform duration-500" />
                  <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase leading-none mb-4">SMART <br/> STOCKING.</h3>
                  <p className="text-slate-200 font-medium text-base md:text-lg">
                    Relax and select your grocery list in the app. We arrange logistics to move your monthly stock to your doorstep.
                  </p>
                  <div className="mt-8 flex gap-3">
                    <span className="px-4 py-2 bg-[#10B981] text-black text-[10px] md:text-xs font-black uppercase">Grocery Logistics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

       {/* 7. CHOOSE YOUR PATH (Fixed Hierarchy) */}
        <section className="py-20 md:py-32 px-6 bg-white dark:bg-[#050505] transition-colors duration-300 relative z-10">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                CHOOSE YOUR <span className="text-[#FF6B00]">PATH.</span>
              </h2>
              
              {/* THE TOGGLE (Business vs Individual) */}
              <div className="inline-flex p-2 bg-slate-100 dark:bg-[#111] rounded-full border border-slate-200 dark:border-white/10">
                <button 
                  onClick={() => setActiveTab("personal")}
                  className={`px-8 py-3 rounded-full text-xs md:text-sm font-black uppercase tracking-widest transition-all ${activeTab === "personal" ? 'bg-[#FF6B00] text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  For Individuals
                </button>
                <button 
                  onClick={() => setActiveTab("company")}
                  className={`px-8 py-3 rounded-full text-xs md:text-sm font-black uppercase tracking-widest transition-all ${activeTab === "company" ? 'bg-[#FF6B00] text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  For Companies
                </button>
              </div>
            </div>

            {/* CONTENT SWITCHER */}
            <div className="min-h-[500px]">
              
              {/* VIEW 1: INDIVIDUALS (The 3 Specific Types) */}
              {activeTab === "personal" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {/* 1. REGULAR (The Daily Hustler) */}
                  <PlanCard 
                    title="THE REGULAR" 
                    subtitle="Daily Survival"
                    desc="For the freelancer or creative. Secure your daily bread and automate your feeding." 
                    icon={<Utensils/>} 
                  />
                  
                  {/* 2. WORKER (The 9-5 Salaried) */}
                  <PlanCard 
                    title="THE WORKER" 
                    subtitle="Salary Protection"
                    desc="Don't let transport costs eat your lunch money. Lock your salary the moment it lands." 
                    active 
                    icon={<ShieldCheck/>} 
                  />
                  
                  {/* 3. FAMILY (Dependents) */}
                  <PlanCard 
                    title="THE FAMILY" 
                    subtitle="Household Care"
                    desc="Feeding kids or parents? Send credits remotely and ensure they eat well, even when you're away." 
                    icon={<ShoppingBasket/>} 
                  />
                </motion.div>
              )}

              {/* VIEW 2: COMPANY (The Corporate Vault) */}
              {activeTab === "company" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden border border-white/10"
                >
                  {/* Background Decor */}
                  <div className="absolute right-0 top-0 w-1/2 h-full bg-[#FF6B00]/10 skew-x-12 blur-3xl"></div>
                  
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                      <div className="inline-block px-4 py-2 bg-[#FF6B00] text-black text-xs font-black uppercase tracking-widest rounded-lg">B2B Solution</div>
                      <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                        THE CORPORATE <br/> <span className="text-[#FF6B00]">VAULT.</span>
                      </h3>
                      <p className="text-xl text-slate-300 font-medium max-w-md">
                        Disburse meal allowances to 10 or 10,000 staff instantly. Ensure your workforce is fueled and focused.
                      </p>
                      <ul className="space-y-4">
                        <li className="flex items-center gap-3 font-bold uppercase text-sm tracking-wider"><Check className="text-[#10B981]"/> Bulk Disbursement</li>
                        <li className="flex items-center gap-3 font-bold uppercase text-sm tracking-wider"><Check className="text-[#10B981]"/> Tax Deductible (Welfare)</li>
                        <li className="flex items-center gap-3 font-bold uppercase text-sm tracking-wider"><Check className="text-[#10B981]"/> Usage Analytics</li>
                      </ul>
                      <Link 
                        href="/auth?mode=signup" 
                        className="inline-block px-8 py-4 bg-white text-black font-black uppercase italic tracking-wider hover:bg-[#10B981] hover:text-white transition-colors rounded-xl"
                      >
                        Deploy Company Vault
                      </Link>
                    </div>
                    
                    {/* Visual for Company */}
                    <div className="h-full min-h-[300px] bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center relative">
                       <ShieldCheck size={120} className="text-[#FF6B00] opacity-50" />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                       <div className="absolute bottom-8 left-8 right-8">
                         <div className="flex justify-between items-center text-sm font-bold uppercase text-slate-500 mb-2">
                           <span>Staff Funded</span>
                           <span className="text-[#10B981]">1,240 / 1,240</span>
                         </div>
                         <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full w-full bg-[#10B981]"></div>
                         </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </section>

        {/* 8. FINAL CTA */}
        <section className="py-20 md:py-32 px-4 md:px-6 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="max-w-7xl mx-auto bg-[#FF6B00] p-12 md:p-24 text-center relative overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl cursor-pointer"
          >
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <h2 className="text-5xl md:text-9xl font-black italic uppercase tracking-tighter text-black relative z-10 leading-[0.8] group-hover:scale-105 transition-transform duration-500">
               DON'T STARVE <br/> IN MARCH.
             </h2>
             <div className="mt-8 md:mt-12 flex justify-center relative z-10">
               <Link 
                 href="/auth?mode=signup" 
                 className="inline-flex items-center justify-center h-16 md:h-20 px-10 md:px-16 bg-black text-white font-black uppercase italic tracking-tighter text-lg md:text-xl hover:bg-[#10B981] hover:text-black transition-colors border border-white/10 rounded-lg"
               >
                 Secure Next Month Now
               </Link>
             </div>
          </motion.div>
        </section>

      </main>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
        @keyframes slow-pan { 0% { transform: scale(1.05); } 100% { transform: scale(1.15); } }
        .animate-slow-pan { animation: slow-pan 20s linear infinite alternate; }
      `}</style>
    </div>
  );
}

function PlanCard({ title, subtitle, desc, active, icon }) {
  return (
    <motion.div 
      whileHover={{ y: -15, scale: 1.02 }}
      className={`p-8 md:p-12 border-2 flex flex-col justify-between min-h-[350px] md:min-h-[400px] rounded-[2rem] shadow-lg cursor-pointer ${active ? 'border-[#FF6B00] bg-[#FF6B00]/5 hover:shadow-orange-500/30' : 'border-slate-200 dark:border-white/10 hover:border-[#10B981] bg-slate-50 dark:bg-transparent hover:shadow-emerald-500/20'}`}
    >
      <div className="space-y-6">
        <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl rounded-2xl ${active ? 'bg-[#FF6B00] text-black' : 'bg-white dark:bg-white/10 text-slate-900 dark:text-white'}`}>{icon}</div>
        <div>
          <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">{title}</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-[#10B981] mt-2">{subtitle}</p> {/* NEW SUBTITLE */}
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium text-base md:text-lg leading-relaxed">{desc}</p>
      </div>
      <div className="pt-8 border-t border-slate-200 dark:border-white/10 mt-8">
        <Link 
          href="/auth?mode=signup" 
          className={`w-full py-4 font-black uppercase italic tracking-wider rounded-xl transition-colors block text-center ${active ? 'bg-[#FF6B00] text-black hover:bg-[#10B981]' : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-[#10B981] hover:text-black'}`}
        >
          Start Plan
        </Link>
      </div>
    </motion.div>
  );
}