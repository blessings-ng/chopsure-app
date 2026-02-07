import { CreditCard, Wifi } from "lucide-react";

export default function DigitalCard() {
  return (
    <div className="w-full h-64 rounded-[2rem] bg-gradient-to-br from-[#0a0a0a] to-[#222] p-8 relative overflow-hidden shadow-2xl border border-white/5 text-white group hover:scale-[1.01] transition-transform duration-500">
      
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Card Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
             <CreditCard size={24} className="text-[#FF6B00]" />
          </div>
          <Wifi size={24} className="text-white/20 rotate-90" />
        </div>

        <div>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mb-1">Total Vault Balance</p>
          <div className="flex items-baseline gap-1">
             <span className="text-2xl font-medium text-white/50">₦</span>
             <h2 className="text-5xl font-black tracking-tighter">145,200<span className="text-2xl text-white/50">.00</span></h2>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">Card Holder</p>
            <p className="font-bold tracking-wide">BLESSING IGWE</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">Expires</p>
             <p className="font-bold tracking-wide">12/28</p>
          </div>
        </div>
      </div>
    </div>
  );
}