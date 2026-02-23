import { Plus, Minus } from "lucide-react";

export default function ProductCard({ product, qty, addToCart, removeFromCart }) {
  return (
    <div className="group bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-2xl p-2.5 md:p-4 hover:shadow-xl hover:shadow-[#FF6B00]/10 transition-all duration-300 flex flex-col justify-between h-full">
      <div className="w-full">
        <div className="relative h-32 md:h-40 w-full mb-3 md:mb-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          {qty > 0 && (
            <div className="absolute top-1.5 right-1.5 bg-[#FF6B00] text-white text-[8px] md:text-[10px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded-md uppercase tracking-wide shadow-lg">
              {qty} in cart
            </div>
          )}
        </div>

        <h3 className="font-bold text-[13px] md:text-base text-slate-900 dark:text-white truncate leading-tight">
          {product.name}
        </h3>
        <p className="text-[9px] md:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-3 md:mb-4">
          {product.category}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <p className="font-black text-xs md:text-base text-[#FF6B00]">
          ₦{product.price.toLocaleString()}
        </p>
        
        {qty === 0 ? (
          <button 
            onClick={() => addToCart(product.id)} 
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-all active:scale-90"
          >
            {/* FIXED: Removed md:size and used className instead */}
            <Plus className="w-[14px] h-[14px] md:w-[16px] md:h-[16px]" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 md:gap-2 bg-[#FF6B00]/10 rounded-full px-1.5 py-1 md:px-2">
            <button 
              onClick={() => removeFromCart(product.id)} 
              className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white text-[#FF6B00] flex items-center justify-center active:scale-125 transition-transform shadow-sm"
            >
              <Minus className="w-[10px] h-[10px] md:w-[12px] md:h-[12px]" strokeWidth={4} />
            </button>
            <span className="text-[10px] md:text-xs font-black text-[#FF6B00] min-w-[12px] text-center">
              {qty}
            </span>
            <button 
              onClick={() => addToCart(product.id)} 
              className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center active:scale-125 transition-transform"
            >
              <Plus className="w-[10px] h-[10px] md:w-[12px] md:h-[12px]" strokeWidth={4} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}