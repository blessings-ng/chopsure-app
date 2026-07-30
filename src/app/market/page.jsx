"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { PRODUCTS, CATEGORIES } from "@/data/raw-food";
import Header from "@/components/market/Header";
import ProductCard from "@/components/market/ProductCard";
import CartSidebar from "@/components/market/CartSidebar";
import { Loader2, Lock } from "lucide-react"; 
import Link from "next/link";

export default function MiniMartPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({}); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [consumptionMode, setConsumptionMode] = useState(null);

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/auth/login");
      setUser(user);

      const { data: wallet } = await supabase
        .from("wallets")
        .select("consumption_mode")
        .eq("user_id", user.id)
        .maybeSingle();

      setConsumptionMode(wallet?.consumption_mode || "cooked");
      setLoading(false);
    }
    getUserData();
  }, [supabase, router]);

  const addToCart = (id) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) newCart[id] -= 1;
      else delete newCart[id];
      return newCart;
    });
  };
  const deleteItem = (id) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
  };

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesCategory && product.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
      <Loader2 className="animate-spin text-[#FF6B00]" size={40} />
    </div>
  );

  if (consumptionMode === "cooked") {
    return (
      <div className="min-h-[100dvh] w-full overflow-hidden bg-slate-50 dark:bg-[#050505] flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white dark:bg-[#111] border border-red-500/20 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} strokeWidth={2.5} className="sm:w-10 sm:h-10" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2">
            Access Denied
          </h1>
          
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            The Raw Mart is strictly reserved for users on the Raw Consumption Mode. Your current unit is for Cooked meals.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link 
              href="/dashboard" 
              className="w-full flex-1 flex justify-center items-center py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              Dashboard
            </Link>
            
            <Link 
              href="/subscription" 
              className="w-full flex-1 flex justify-center items-center py-4 bg-[#FF6B00] text-black rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
            >
              Change Mode
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col overflow-x-hidden">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        cartCount={cartCount} 
        setIsCartOpen={setIsCartOpen}
        isCartOpen={isCartOpen}
      />

      <div className="flex-1 w-full">
        <div className="sticky top-[72px] z-30 bg-white dark:bg-[#050505] border-b border-slate-200 dark:border-white/5 py-4 px-4 sm:px-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 sm:px-6 py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap shrink-0 ${activeCategory === cat ? 'bg-[#FF6B00] border-[#FF6B00] text-black shadow-lg' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <main className="w-full p-4 sm:p-6 md:p-8 pb-32"> 
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                qty={cart[product.id] || 0}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>
        </main>
      </div>

      <CartSidebar 
        isOpen={isCartOpen} 
        setIsOpen={setIsCartOpen} 
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        deleteItem={deleteItem}
        user={user} 
      />
    </div>
  );
}