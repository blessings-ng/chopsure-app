"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, Loader2, X, ShoppingBag, ArrowRight, AlertCircle, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/data/raw-food";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function CartSidebar({ isOpen, setIsOpen, cart = {}, addToCart, removeFromCart, deleteItem }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      const fetchBalance = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: wallet } = await supabase.from("wallets").select("balance").eq("user_id", user.id).maybeSingle();
          if (wallet) setCurrentBalance(wallet.balance);
        }
      };
      fetchBalance();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, supabase]);

  const cartTotal = Object.entries(cart || {}).reduce((total, [id, qty]) => {
    const product = PRODUCTS.find(p => p.id === parseInt(id));
    return product ? total + (product.price * qty) : total;
  }, 0);

  const isOverBalance = cartTotal > currentBalance;

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  const handleCheckout = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      if (!user) throw new Error("Session expired. Please log in again.");

      // 1. SUBSCRIPTION CHECK (GATE 1)
      const tier = user?.user_metadata?.subscription_tier;
      if (!tier) {
        setErrorMsg("Plan Inactive: Redirecting to Subscription Plans...");
        setTimeout(() => {
          setIsOpen(false);
          router.push("/subscription");
        }, 3500); // 
        return;
      }

      // 2. WINDOW CHECK FOR RAW USERS (GATE 2)
      const { data: walletData } = await supabase
        .from("wallets")
        .select("consumption_mode, balance")
        .eq("user_id", user.id)
        .single();

      const today = new Date().getDate();
      const isWindowOpen = (today >= 10 && today <= 13) || (today >= 25 && today <= 28);

      if (walletData?.consumption_mode === "raw" && !isWindowOpen) {
        showError("Action cannot be carried out now. Check back on 10th-13th and 25th-28th");
        setLoading(false);
        return;
      }

      // 3. FUNDS CHECK
      if (walletData.balance < cartTotal) {
        showError("Insufficient Funds. Top up your wallet to proceed.");
        setLoading(false);
        return;
      }

      // 4. EXECUTE TRANSACTION
      const ref = `RMART-${Math.random().toString(36).toUpperCase().slice(2, 9)}`;
      const { error: updateError } = await supabase
        .from("wallets")
        .update({ balance: walletData.balance - cartTotal })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      await supabase.from("transactions").insert({
        user_id: user.id,
        amount: cartTotal,
        category: "debit",
        description: "Bulk Grocery",
        status: "success",
        reference: ref
      });

      setIsOpen(false);
      router.push(`/receipt/${ref}`); 
    } catch (err) {
      showError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[998] cursor-pointer" 
              onClick={() => setIsOpen(false)} 
            />

            <motion.aside 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white dark:bg-[#0a0a0a] shadow-2xl z-[999] flex flex-col"
            >
              <div className="h-full flex flex-col relative">
                
                {/* HEADER */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                  <div>
                    <h2 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white leading-none">Your Cart</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FF6B00] mt-2 flex items-center gap-2">
                      <Wallet size={12}/> Vault: ₦{currentBalance.toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                    className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-500 hover:text-red-500 transition-all active:scale-90"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* SCROLLABLE ITEMS */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                  {(!cart || Object.keys(cart).length === 0) ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                      <ShoppingBag size={64} className="mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No items selected</p>
                    </div>
                  ) : (
                    Object.entries(cart).map(([id, qty]) => {
                      const product = PRODUCTS.find(p => p.id === parseInt(id));
                      if (!product) return null;
                      return (
                        <div key={id} className="flex gap-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-3xl border border-slate-100 dark:border-white/5 items-center">
                          <img src={product.image} className="w-16 h-16 rounded-2xl object-cover shrink-0" alt={product.name} />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.name}</h4>
                            <p className="text-xs text-[#FF6B00] font-black mt-0.5">₦{product.price.toLocaleString()}</p>
                            <div className="flex items-center gap-3 mt-3">
                              <button onClick={() => removeFromCart(id)} className="w-8 h-8 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all"><Minus size={14}/></button>
                              <span className="text-xs font-black">{qty}</span>
                              <button onClick={() => addToCart(id)} className="w-8 h-8 rounded-xl bg-[#FF6B00] text-black flex items-center justify-center hover:scale-105 transition-all"><Plus size={14}/></button>
                            </div>
                          </div>
                          <button onClick={() => deleteItem(id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* FOOTER */}
                {cart && Object.keys(cart).length > 0 && (
                  <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] pb-10">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total</span>
                      <span className={`text-2xl font-black italic ${isOverBalance ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                        ₦{cartTotal.toLocaleString()}
                      </span>
                    </div>

                    {/* NEW: SLEEK IN-APP ERROR ANIMATION */}
                    <AnimatePresence>
                      {errorMsg && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, height: 0, marginBottom: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto", marginBottom: 16 }}
                          exit={{ opacity: 0, y: 10, height: 0, marginBottom: 0 }}
                          className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-500 items-start overflow-hidden"
                        >
                          <AlertCircle size={18} className="shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Action Denied</p>
                            <p className="text-[9px] font-bold mt-1 opacity-80 uppercase leading-snug">{errorMsg}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isOverBalance ? (
                      <button onClick={() => { setIsOpen(false); router.push("/top-up"); }} className="w-full h-16 border-2 border-[#FF6B00] text-[#FF6B00] font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl flex items-center justify-center gap-3">
                        <Wallet size={20} /> Top Up Wallet
                      </button>
                    ) : (
                      <button onClick={handleCheckout} disabled={loading} className="w-full h-16 bg-[#FF6B00] text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:active:scale-100">
                        {loading ? <Loader2 className="animate-spin" /> : <>Confirm Purchase <ArrowRight size={20} /></>}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}