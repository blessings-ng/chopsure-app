import { Plus, Minus } from "lucide-react";

export default function ProductCard({ product, qty, addToCart, removeFromCart }) {
  return (
    <div className="group bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-2xl p-4 hover:shadow-xl hover:shadow-[#FF6B00]/10 transition-all duration-300">
      <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {qty > 0 && (
          <div className="absolute top-2 right-2 bg-[#FF6B00] text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wide shadow-lg">
            In Cart: {qty}
          </div>
        )}
      </div>

      <h3 className="font-bold text-slate-900 dark:text-white truncate">{product.name}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-4">{product.category}</p>
      
      <div className="flex items-center justify-between">
        <p className="font-black text-[#FF6B00]">₦{product.price.toLocaleString()}</p>
        
        {qty === 0 ? (
          <button onClick={() => addToCart(product.id)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors">
            <Plus size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-[#FF6B00]/10 rounded-full px-2 py-1">
            <button onClick={() => removeFromCart(product.id)} className="w-6 h-6 rounded-full bg-white text-[#FF6B00] flex items-center justify-center hover:scale-110 transition-transform"><Minus size={12} strokeWidth={3} /></button>
            <span className="text-xs font-black text-[#FF6B00]">{qty}</span>
            <button onClick={() => addToCart(product.id)} className="w-6 h-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center hover:scale-110 transition-transform"><Plus size={12} strokeWidth={3} /></button>
          </div>
        )}
      </div>
    </div>
  );
}