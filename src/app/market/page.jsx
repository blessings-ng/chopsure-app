"use client";

import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/data/raw-food";
import Header from "@/components/market/Header";
import ProductCard from "@/components/market/ProductCard";
import CartSidebar from "@/components/market/CartSidebar";
import { ShoppingBag, Filter, X } from "lucide-react"; 

export default function MiniMartPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({}); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cart ? Object.values(cart).reduce((a, b) => a + b, 0) : 0;

  return (
    // Ensure the root container is relative and allows the sticky header to anchor to the window
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#050505] font-sans flex flex-col">
      
      {/* HEADER: Direct child of the root ensures top-0 is always the window top */}
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        cartCount={cartCount} 
        setIsCartOpen={setIsCartOpen} 
      />

      {/* MOBILE FILTER TRIGGER */}
      <button 
        onClick={() => setIsFilterOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-[70] bg-[#FF6B00] text-white p-4 rounded-full shadow-2xl flex items-center gap-2 active:scale-90 transition-all font-black uppercase italic text-xs tracking-widest"
      >
        <Filter size={18} />
        Filter
      </button>

      {/* MOBILE FILTER MODAL */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[110] md:hidden bg-black/60 backdrop-blur-md flex items-end" onClick={() => setIsFilterOpen(false)}>
          <div className="w-full bg-white dark:bg-[#0a0a0a] rounded-t-[2.5rem] p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black italic uppercase text-lg text-slate-900 dark:text-white">Categories</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pb-10 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setIsFilterOpen(false); }}
                  className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    activeCategory === cat ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        {/* DESKTOP CATEGORY BAR */}
        <div className="hidden md:block sticky top-[72px] z-30 bg-white dark:bg-[#050505] border-b border-slate-200 dark:border-white/5 py-4 px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all whitespace-nowrap shrink-0 ${activeCategory === cat ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-lg shadow-orange-500/20' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <main className="w-full p-4 md:p-8 pb-32"> 
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  qty={cart ? (cart[product.id] || 0) : 0}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
          ) : (
            <div className="h-[40vh] flex flex-col items-center justify-center text-slate-400">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p className="font-black uppercase tracking-widest text-[10px]">No Items Found</p>
            </div>
          )}
        </main>
      </div>

      <CartSidebar 
        isOpen={isCartOpen} 
        setIsOpen={setIsCartOpen} 
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        deleteItem={deleteItem}
      />
    </div>
  );
}