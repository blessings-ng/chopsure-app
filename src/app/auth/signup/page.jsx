"use client";

import Link from "next/link";
import { Lock, Mail, ArrowLeft, CheckCircle2, Eye, EyeOff, Check, X, MapPin, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [isLengthValid, setIsLengthValid] = useState(false);
  
  // SUPABASE & UI STATES
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false); // NEW: State for email check

  // REAL-TIME VALIDATION
  useEffect(() => {
    setIsLengthValid(formData.password.length >= 6);
    if (formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch || !isLengthValid || !termsAccepted) return;
    
    setIsLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Point to your confirmation route
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data?.user && !data?.session) {
        setIsEmailSent(true);
        setIsLoading(false);
      } else {
        setShowToast(true);
        setTimeout(() => {
          router.push("/welcome"); 
        }, 3000);
      }
      
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message); 
      setIsLoading(false);
    }
  };

  const isFormValid = passwordsMatch && isLengthValid && termsAccepted && !isLoading;

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#050505] font-sans selection:bg-[#FF6B00] selection:text-white transition-colors duration-500 relative overflow-hidden">
      
      {/* LEFT SIDE - SIGNUP FORM */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-10 relative z-10 bg-white dark:bg-[#050505] transition-colors duration-500 border-r border-slate-100 dark:border-white/5 overflow-y-auto">
        
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Link href="/auth" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#FF6B00] transition-colors font-bold uppercase tracking-widest text-[10px] mb-8">
            <ArrowLeft size={14} /> Back to Selection
          </Link>

          <div className="mb-8">
            <span className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">
              ChopSure
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!isEmailSent ? (
              <>
                <h1 className="text-3xl md:text-4xl font-black italic text-slate-900 dark:text-white uppercase mb-2">Secure My Month</h1>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium mb-8">Create your food budget plan.</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500 text-xs font-bold uppercase tracking-wide">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" /> 
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup label="First Name" name="firstName" type="text" onChange={handleChange} />
                    <InputGroup label="Last Name" name="lastName" type="text" onChange={handleChange} />
                  </div>
                  
                  <InputGroup label="User Name" name="username" type="text" onChange={handleChange} />
                  <InputGroup label="Email Address" name="email" type="email" icon={<Mail size={18}/>} onChange={handleChange} />
                  
                  <div className="space-y-4">
                    <PasswordInputGroup label="Create Password" name="password" onChange={handleChange} isValid={isLengthValid} />
                    <PasswordInputGroup label="Confirm Password" name="confirmPassword" onChange={handleChange} isValid={passwordsMatch} showValidation={formData.confirmPassword.length > 0} />

                    <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-wide px-2">
                       <div className={`flex items-center gap-2 transition-colors duration-300 ${isLengthValid ? "text-green-500" : "text-slate-400"}`}>
                          {isLengthValid ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-400"></div>}
                          At least 6 characters
                       </div>
                       <div className={`flex items-center gap-2 transition-colors duration-300 ${passwordsMatch === true ? "text-green-500" : passwordsMatch === false ? "text-red-500" : "text-slate-400"}`}>
                          {passwordsMatch === true ? <Check size={12} /> : passwordsMatch === false ? <X size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-400"></div>}
                          {passwordsMatch === false ? "Passwords do not match" : "Passwords match"}
                       </div>
                    </div>
                  </div>
                  
                  <label className="flex gap-3 items-start p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 mt-4 cursor-pointer group hover:border-[#FF6B00]/30 transition-colors">
                    <div className="relative mt-0.5">
                      <input type="checkbox" className="peer sr-only" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                      <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${termsAccepted ? 'bg-[#FF6B00] border-[#FF6B00]' : 'border-slate-300 dark:border-slate-600 group-hover:border-[#FF6B00]'}`}>
                        <Check size={14} className={`text-white transition-transform ${termsAccepted ? 'scale-100' : 'scale-0'}`} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed select-none">
                      By checking this box, I agree to lock my budget and understand I cannot withdraw cash impulsively.
                    </p>
                  </label>

                  <button type="submit" disabled={!isFormValid} className={`relative w-full h-12 rounded-full font-bold uppercase tracking-wider overflow-hidden transition-all mt-4 group ${isFormValid ? "bg-transparent border-2 border-[#FF6B00] text-[#FF6B00] dark:text-white hover:text-white cursor-pointer" : "bg-slate-100 dark:bg-white/10 text-slate-400 border-none cursor-not-allowed"}`}>
                    {isFormValid && <span className="absolute inset-0 w-full h-full bg-[#FF6B00] translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10"></span>}
                    <span className="relative z-10">{isLoading ? "Creating..." : "Create Account"}</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="py-10 text-left animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="w-16 h-16 bg-[#FF6B00]/10 text-[#FF6B00] rounded-full flex items-center justify-center mb-6">
                  <Mail size={32} className="animate-pulse" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black italic text-slate-900 dark:text-white uppercase mb-4">Check Your Mail</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                  We've sent a verification link to <span className="text-[#FF6B00] font-bold">{formData.email}</span>. Please check your inbox to activate your account.
                </p>
                <button onClick={() => setIsEmailSent(false)} className="text-[#FF6B00] font-black uppercase tracking-widest text-[10px] hover:underline">
                  Wrong email? Go back
                </button>
              </div>
            )}

            {!isEmailSent && (
              <p className="mt-8 text-center text-sm font-medium text-slate-500">
                Already secured? <Link href="/auth/login" className="ml-2 text-[#FF6B00] font-bold hover:underline">Login here</Link>
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - VISUAL */}
      <div className="hidden lg:flex w-[55%] bg-[#0a0a0a] relative overflow-hidden items-center justify-center p-20">
         <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 grayscale" alt="Food Texture" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-[#FF6B00]/20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 max-w-lg">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md">
              <CheckCircle2 size={14} /> Guaranteed Meals
           </div>
           <h2 className="text-6xl font-black italic text-white uppercase leading-[0.9] tracking-tighter mb-6">
             Start <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-orange-400">Locking Today.</span>
           </h2>
           <p className="text-lg text-white/70 font-medium leading-relaxed mb-10">
             Join thousands of Nigerians who have automated their feeding. Lock your budget once, eat everyday. No stories.
           </p>
           <div className="flex gap-8 border-t border-white/10 pt-8">
             <div><p className="text-3xl font-black text-white">12k+</p><p className="text-xs text-white/50 uppercase tracking-widest font-bold">Users Fed</p></div>
             <div><div className="flex items-baseline gap-1"><p className="text-3xl font-black text-white">50+</p><MapPin size={16} className="text-[#FF6B00]" /></div><p className="text-xs text-white/50 uppercase tracking-widest font-bold">Partner Eateries</p></div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="fixed bottom-10 right-4 md:right-10 z-[100] bg-[#10B981] p-1 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.3)]">
            <div className="bg-[#050505] rounded-xl px-6 py-4 flex items-center gap-4 border border-[#10B981]/30">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981]"><CheckCircle2 size={24} /></div>
              <div><h4 className="text-white font-black italic uppercase tracking-wider text-sm md:text-base leading-none mb-1">Vault Secured.</h4><p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Redirecting to Dashboard...</p></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputGroup({ label, name, type, icon, onChange }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00] transition-colors">{icon}</div>
      <input type={type} name={name} onChange={onChange} placeholder=" " required className={`peer w-full h-12 md:h-14 bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/5 rounded-xl outline-none text-slate-900 dark:text-white font-bold transition-all duration-300 focus:border-[#FF6B00] focus:bg-white dark:focus:bg-black ${icon ? 'pl-12' : 'pl-4'} pr-4 pt-4`} />
      <label className={`absolute left-0 pointer-events-none text-xs font-bold uppercase tracking-wide text-slate-400 transition-all duration-300 peer-focus:text-[10px] peer-focus:top-3 peer-focus:text-[#FF6B00] peer-placeholder-shown:text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 ${icon ? 'peer-focus:left-12 peer-placeholder-shown:left-12' : 'peer-focus:left-4 peer-placeholder-shown:left-4'} top-3`}>{label}</label>
    </div>
  );
}

function PasswordInputGroup({ label, name, onChange, isValid, showValidation = false }) {
  const [showPassword, setShowPassword] = useState(false);
  let borderColor = "border-slate-100 dark:border-white/5 focus:border-[#FF6B00]";
  if (showValidation) {
    if (isValid === true) borderColor = "border-green-500 focus:border-green-500";
    if (isValid === false) borderColor = "border-red-500 focus:border-red-500";
  }
  return (
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${showValidation && isValid === false ? "text-red-500" : "text-slate-400 group-focus-within:text-[#FF6B00]"}`}><Lock size={18} /></div>
      <input type={showPassword ? "text" : "password"} name={name} onChange={onChange} placeholder=" " required className={`peer w-full h-12 md:h-14 bg-slate-50 dark:bg-white/5 border-2 rounded-xl outline-none text-slate-900 dark:text-white font-bold transition-all duration-300 focus:bg-white dark:focus:bg-black pl-12 pr-12 pt-4 ${borderColor}`} />
      <label className={`absolute left-12 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wide pointer-events-none transition-all duration-300 peer-focus:text-[10px] peer-focus:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-12 top-3 ${showValidation && isValid === false ? "text-red-400 peer-focus:text-red-500" : "text-slate-400 peer-focus:text-[#FF6B00]"}`}>{label}</label>
      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#FF6B00] transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
    </div>
  );
}