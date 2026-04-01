"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { PRODUCTS, CATEGORIES } from "@/data/raw-food";
import Header from "@/components/market/Header";
import ProductCard from "@/components/market/ProductCard";
import CartSidebar from "@/components/market/CartSidebar";
import { Loader2 } from "lucide-react"; 

export default function MiniMartPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({}); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/auth/login");
      setUser(user);
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

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        cartCount={cartCount} 
        setIsCartOpen={setIsCartOpen}
        isCartOpen={isCartOpen}
      />

      <div className="flex-1 w-full">
        {/* Category Bar */}
        <div className="sticky top-[72px] z-30 bg-white dark:bg-[#050505] border-b border-slate-200 dark:border-white/5 py-4 px-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-[#FF6B00] border-[#FF6B00] text-black shadow-lg' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <main className="w-full p-4 md:p-8 pb-32"> 
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
        user={user} // Pass user to sidebar for validation
      />
    </div>
  );
}