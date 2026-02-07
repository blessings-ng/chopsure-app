import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { PRODUCTS } from "@/data/raw-food";

export default function CartSidebar({ isOpen, setIsOpen, cart = {}, addToCart, removeFromCart, deleteItem }) {
  
  // FIXED: Added (cart || {}) to prevent crash if cart is undefined
  const cartTotal = Object.entries(cart || {}).reduce((total, [id, qty]) => {
    const product = PRODUCTS.find(p => p.id === parseInt(id));
    // Safety check: if product not found, return current total
    return product ? total + (product.price * qty) : total;
  }, 0);

  return (
    <>
      <aside className={`fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-white dark:bg-[#0a0a0a] border-l border-slate-200 dark:border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white">Your Cart</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full">
              <ArrowLeft size={20} className="md:hidden" />
              <span className="hidden md:block text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-[#FF6B00]">Close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* FIXED: Check if cart exists and has keys */}
            {(!cart || Object.keys(cart).length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <ShoppingCart size={48} className="mb-4 text-slate-300 dark:text-slate-700" />
                <p className="text-sm font-bold uppercase tracking-widest">Cart is Empty</p>
              </div>
            ) : (
              Object.entries(cart).map(([id, qty]) => {
                const product = PRODUCTS.find(p => p.id === parseInt(id));
                if (!product) return null; // Safety check
                return (
                  <div key={id} className="flex gap-4 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                    <img src={product.image} className="w-16 h-16 rounded-lg object-cover bg-white" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</h4>
                      <p className="text-xs text-[#FF6B00] font-black mt-1">₦{product.price.toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button onClick={() => removeFromCart(id)} className="p-1 hover:text-red-500 transition-colors"><Minus size={14}/></button>
                        <span className="text-xs font-bold">{qty}</span>
                        <button onClick={() => addToCart(id)} className="p-1 hover:text-[#FF6B00] transition-colors"><Plus size={14}/></button>
                      </div>
                    </div>
                    <button onClick={() => deleteItem(id)} className="text-slate-300 hover:text-red-500 self-start p-1 transition-colors"><Trash2 size={16} /></button>
                  </div>
                );
              })
            )}
          </div>

          {cart && Object.keys(cart).length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Subtotal</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">₦{cartTotal.toLocaleString()}</span>
              </div>
              <button className="w-full h-14 bg-[#FF6B00] text-white font-black uppercase italic tracking-wider rounded-xl hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]">Checkout Now</button>
            </div>
          )}
        </div>
      </aside>
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
}