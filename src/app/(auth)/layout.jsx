export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden bg-[#0A0F1C]">
      {/* 1. BRANDED BACKGROUND GLOWS */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Top-Left Brand Glow */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-[#FF6B00]/10 rounded-full blur-[120px] animate-pulse" />
        
        {/* Bottom-Right Sub-Glow */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#FF6B00]/5 rounded-full blur-[100px]" />
        
        {/* Grid Pattern for 'Fintech' feel */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* 2. THE GLASS STAGE (The Container for the Rolling Card) */}
      <div className="w-full max-w-[1050px] min-h-[650px] relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        {children}
      </div>

      {/* 3. FOOTER BRANDING */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-30 grayscale pointer-events-none">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Secure Infrastructure</span>
        <div className="h-1 w-1 rounded-full bg-white" />
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">ChopSure v1.0</span>
      </div>
    </div>
  );
}