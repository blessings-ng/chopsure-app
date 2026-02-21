"use client";

import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/data/raw-food";
import Header from "@/components/market/Header";
import ProductCard from "@/components/market/ProductCard";
import CartSidebar from "@/components/market/CartSidebar";
import { ShoppingBag } from "lucide-react"; 

export default function MiniMartPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({}); 
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] font-sans">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        cartCount={cartCount} 
        setIsCartOpen={setIsCartOpen} 
      />

      <div className="flex">
        {/* The main content scrolls, but the Header (sticky) and Sidebar (fixed) stay put */}
        <main className="flex-1 p-6 md:p-8">
          
          {/* Categories Tab - NOT sticky. It will scroll under the solid header */}
          <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
            <div className="h-[50vh] flex flex-col items-center justify-center text-slate-400">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p className="font-black uppercase tracking-widest text-[10px]">No Items Found</p>
            </div>
          )}
        </main>

        <CartSidebar 
          isOpen={isCartOpen} 
          setIsOpen={setIsCartOpen} 
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          deleteItem={deleteItem}
        />
      </div>
    </div>
  );
}