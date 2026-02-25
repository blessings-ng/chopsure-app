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
  
  // DETAILED PASSWORD STATES
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    symbol: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  // UPDATED VALIDATION LOGIC
  useEffect(() => {
    const pwd = formData.password;
    setPasswordValidation({
      length: pwd.length >= 6,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    });

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

  const isPasswordSecure = Object.values(passwordValidation).every(Boolean);
  const isFormValid = isPasswordSecure && passwordsMatch && termsAccepted && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          setIsEmailSent(true);
          setIsLoading(false);
          return;
        }
        throw signUpError;
      }

      if (data?.user) {
        setIsEmailSent(true);
        setIsLoading(false);
      }
      
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message); 
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#050505] font-sans selection:bg-[#FF6B00] selection:text-white transition-colors duration-500 relative overflow-hidden">
      
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-10 relative z-10 bg-white dark:bg-[#050505] transition-colors duration-500 border-r border-slate-100 dark:border-white/5 overflow-y-auto">
        
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Link href="/auth" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#FF6B00] transition-colors font-bold uppercase tracking-widest text-[10px] mb-8">
            <ArrowLeft size={14} /> Back to Selection
          </Link>

          <div className="mb-8">
            <span className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase text-balance">
              ChopSure
            </span>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
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
                    <PasswordInputGroup label="Create Password" name="password" onChange={handleChange} isValid={isPasswordSecure} />
                    
                    {/* ENHANCED PASSWORD CRITERIA LIST */}
                    <div className="grid grid-cols-2 gap-y-2 px-2">
                        <ValidationItem isValid={passwordValidation.length} text="6+ Characters" />
                        <ValidationItem isValid={passwordValidation.upper} text="Uppercase (A)" />
                        <ValidationItem isValid={passwordValidation.lower} text="Lowercase (a)" />
                        <ValidationItem isValid={passwordValidation.number} text="Number (1)" />
                        <ValidationItem isValid={passwordValidation.symbol} text="Symbol (#)" />
                    </div>

                    <PasswordInputGroup label="Confirm Password" name="confirmPassword" onChange={handleChange} isValid={passwordsMatch} showValidation={formData.confirmPassword.length > 0} />

                    <div className={`flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-wide transition-colors duration-300 ${passwordsMatch === true ? "text-green-500" : passwordsMatch === false ? "text-red-500" : "text-slate-400"}`}>
                        {passwordsMatch === true ? <Check size={12} /> : passwordsMatch === false ? <X size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-400"></div>}
                        {passwordsMatch === false ? "Passwords do not match" : "Passwords match"}
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
                    <span className="relative z-10">{isLoading ? "Verifying..." : "Create Account"}</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="py-10 text-left">
                <div className="w-16 h-16 bg-[#FF6B00]/10 text-[#FF6B00] rounded-full flex items-center justify-center mb-6">
                  <Mail size={32} className="animate-pulse" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black italic text-slate-900 dark:text-white uppercase mb-4">Check Your Mail</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                  Verification link sent to <span className="text-[#FF6B00] font-bold">{formData.email}</span>. Please check your inbox.
                </p>
                <button onClick={() => setIsEmailSent(false)} className="text-[#FF6B00] font-black uppercase tracking-widest text-[10px] hover:underline">
                  Wrong email? Go back
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="hidden lg:flex w-[55%] bg-[#0a0a0a] relative items-center justify-center p-20">
         <div className="absolute inset-0 z-0 opacity-40 grayscale">
          <img src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Food Texture" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-[#FF6B00]/20 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 max-w-lg">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-xs font-black uppercase tracking-widest mb-8">
              <CheckCircle2 size={14} /> Guaranteed Meals
           </div>
           <h2 className="text-6xl font-black italic text-white uppercase leading-[0.9] tracking-tighter mb-6">
             Start <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-orange-400">Locking Today.</span>
           </h2>
        </div>
      </div>
    </div>
  );
}

// HELPER FOR PASSWORD LIST
function ValidationItem({ isValid, text }) {
    return (
      <div className={`flex items-center gap-2 transition-colors duration-300 ${isValid ? "text-green-500" : "text-slate-400"} text-[10px] font-bold uppercase tracking-tight`}>
        {isValid ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-slate-400"></div>}
        {text}
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
    borderColor = isValid ? "border-green-500" : "border-red-500";
  }
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00]"><Lock size={18} /></div>
      <input type={showPassword ? "text" : "password"} name={name} onChange={onChange} placeholder=" " required className={`peer w-full h-12 md:h-14 bg-slate-50 dark:bg-white/5 border-2 rounded-xl outline-none text-slate-900 dark:text-white font-bold transition-all duration-300 focus:bg-white dark:focus:bg-black pl-12 pr-12 pt-4 ${borderColor}`} />
      <label className="absolute left-12 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wide pointer-events-none transition-all peer-focus:text-[10px] peer-focus:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-12 top-3 text-slate-400 peer-focus:text-[#FF6B00]">{label}</label>
      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#FF6B00] transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
    </div>
  );
}