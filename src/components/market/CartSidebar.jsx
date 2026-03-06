"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Loader2, X, ShoppingBag, ArrowRight, AlertCircle, Wallet } from "lucide-react";
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

  useEffect(() => {
    if (isOpen) {
      const fetchBalance = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: wallet } = await supabase
            .from("wallets")
            .select("balance")
            .eq("user_id", user.id)
            .single();
            
          if (wallet) {
            setCurrentBalance(wallet.balance);
          }
        }
      };
      fetchBalance();
    }
  }, [isOpen, supabase]);

  const cartTotal = Object.entries(cart || {}).reduce((total, [id, qty]) => {
    const product = PRODUCTS.find(p => p.id === parseInt(id));
    return product ? total + (product.price * qty) : total;
  }, 0);

  const isOverBalance = cartTotal > currentBalance;

  const handleCheckout = async () => {
    if (isOverBalance) return; 
    setLoading(true);

    try {
      if (!user) throw new Error("Auth session expired");

      const { data: wallet, error: walletError } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (walletError || !wallet) throw new Error("Wallet not found");

      if (wallet.balance < cartTotal) {
        alert(`Insufficient Funds. Need ₦${cartTotal.toLocaleString()}, have ₦${wallet.balance.toLocaleString()}`);
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("wallets")
        .update({ balance: wallet.balance - cartTotal })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      await supabase.from("transactions").insert({
        user_id: user.id,
        amount: cartTotal,
        category: "debit",
        description: "RawMart Purchase",
        status: "success",
        reference: `RMART-${Math.random().toString(36).toUpperCase().slice(2, 9)}`
      });

      setIsOpen(false);
      router.push("/dashboard?status=purchase_success"); 
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = () => {
    setIsOpen(false);
    router.push("/top-up"); 
  };

  return (
    <>
      <aside className={`fixed inset-y-0 right-0 z-[60] w-full sm:w-[400px] bg-white dark:bg-[#0a0a0a] border-l border-slate-200 dark:border-white/10 shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="h-full flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 dark:border-white/5">
            <div>
              <h2 className="text-xl md:text-2xl font-black italic uppercase text-slate-900 dark:text-white leading-none">Your Cart</h2>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Vault: ₦{currentBalance.toLocaleString()}</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* CART ITEMS */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-hide relative">
            {(!cart || Object.keys(cart).length === 0) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-30">
                <ShoppingBag size={64} className="mb-4 text-slate-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Empty Cart</p>
              </div>
            ) : (
              Object.entries(cart).map(([id, qty]) => {
                const product = PRODUCTS.find(p => p.id === parseInt(id));
                if (!product) return null;
                return (
                  <div key={id} className="flex gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 items-center">
                    <img src={product.image} className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover bg-white shrink-0" alt={product.name} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate">{product.name}</h4>
                      <p className="text-[10px] md:text-xs text-[#FF6B00] font-black mt-0.5">₦{product.price.toLocaleString()}</p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => removeFromCart(id)} className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"><Minus size={12}/></button>
                        <span className="text-xs font-black">{qty}</span>
                        <button onClick={() => addToCart(id)} className="w-6 h-6 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center"><Plus size={12}/></button>
                      </div>
                    </div>
                    <button onClick={() => deleteItem(id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* CHECKOUT FOOTER */}
          {cart && Object.keys(cart).length > 0 && (
            <div className="p-5 md:p-6 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subtotal</span>
                <span className={`text-xl font-black italic ${isOverBalance ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>

              {/* DYNAMIC ERROR MESSAGE */}
              <AnimatePresence>
                {isOverBalance && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }} 
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex items-center gap-3 text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 overflow-hidden"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">
                        Insufficient Funds
                      </p>
                      <p className="text-[8px] font-bold text-red-500/70 uppercase tracking-wider">
                        Short by: ₦{(cartTotal - currentBalance).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DYNAMIC ACTION BUTTON */}
              {isOverBalance ? (
                <button 
                  onClick={handleTopUp}
                  className="w-full h-14 font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-3 border-2 bg-transparent border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-black shadow-xl shadow-orange-500/10 active:scale-95"
                >
                  <Wallet size={18} /> Top Up Wallet
                </button>
              ) : (
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full h-14 bg-[#FF6B00] border-2 border-[#FF6B00] text-black font-black uppercase tracking-wider rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Checkout <ArrowRight size={18} /></>}
                </button>
              )}

            </div>
          )}
        </div>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[55]" 
            onClick={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}